import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface ChatSummary {
    otherUserId: string;
    otherUsername: string;
    lastMessage: string;
    lastSentAt: string;
}

interface SelectedContact {
    id: string;
    username: string;
}

interface Props {
    onSelectContact: (contact: SelectedContact) => void;
    onRemoveContact: (removedId: string, remainingContacts: ChatSummary[]) => void;
}


export const ChatSidebar: React.FC<Props> = ({ onSelectContact, onRemoveContact }) => {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [contacts, setContacts] = useState<ChatSummary[]>([]);
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [contactToRemove, setContactToRemove] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchContacts = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch(`http://localhost:8100/api/chat/summaries`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data: ChatSummary[] = await res.json();
                setContacts(data);
                console.log(JSON.stringify(data));
            } catch (err) {
                console.error(err);
            }
        };

        fetchContacts();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    const handleSelect = (contact: SelectedContact) => {
        setSelectedContact(contact.id);
        onSelectContact(contact);
    };

    const confirmRemoveContact = async (otherUserId: string) => {
        try {
            const token = await getAccessTokenSilently();
            await fetch(`http://localhost:8100/api/chat/contacts/${otherUserId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedContacts = contacts.filter(c => c.otherUserId !== otherUserId);
            setContacts(updatedContacts);
            onRemoveContact(otherUserId, updatedContacts);


            setContactToRemove(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="chat-sidebar">
            {contacts.map(c => (
                <div
                    key={c.otherUserId}
                    className={`chat-contact ${c.otherUserId === selectedContact ? 'selected' : ''}`}
                    onClick={() => handleSelect({ id: c.otherUserId, username: c.otherUsername })}
                >
                    <div className="contact-avatar">
                        {c.otherUserId.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="chat-contact-info">
                        <div className="contact-name">{c.otherUsername}</div>
                        <div className="contact-last-message">{c.lastMessage}</div>
                    </div>

                    <div className="contact-timestamp">
                        {new Date(c.lastSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <button
                        className="remove-contact-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setContactToRemove(c.otherUserId);
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}

            {contactToRemove && (
                <div className="tier-modal-overlay">
                    <div className="tier-modal">
                        <p>Do you want to remove this contact?</p>
                        <button onClick={() => setContactToRemove(null)} style={{ marginRight: '3em' }}>Cancel</button>
                        <button onClick={async () => {
                            await confirmRemoveContact(contactToRemove);
                            setContactToRemove(null);
                        }}>Yes</button>
                    </div>
                </div>
            )}
        </div>
    );
};