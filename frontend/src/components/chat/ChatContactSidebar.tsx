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
}

export const ChatSidebar: React.FC<Props> = ({ onSelectContact }) => {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [contacts, setContacts] = useState<ChatSummary[]>([]);
    const [selectedContact, setSelectedContact] = useState<string | null>(null);

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
                </div>
            ))}
        </div>
    );
};
