import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import '../../styles/TierUpgrade.css';

type Tier = "Free" | "Professional" | "Ultimate";

const TierUpgrade: React.FC<{ currentTier: Tier; onUpgrade: (newTier: Tier) => void }> = ({ currentTier, onUpgrade }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const { getAccessTokenSilently, user } = useAuth0();

    const tiers: Tier[] = ["Free", "Professional", "Ultimate"];

    const handleUpgrade = async (newTier: Tier) => {
        if (newTier === currentTier) {
            setModalMessage("You are already on this tier.");
            return;
        }

        if (tiers.indexOf(newTier) === tiers.indexOf(currentTier)) {
            setModalMessage("You cannot select the same tier.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = await getAccessTokenSilently();
            await axios.post('http://localhost:8080/api/users/upgrade-tier', { newTier }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onUpgrade(newTier);
            setModalMessage(`Successfully upgraded to ${newTier} tier.`);
        } catch (err: any) {
            setError("Failed to upgrade tier. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const purchase = async (tier: Tier) => {
        try {
            const token = await getAccessTokenSilently();

            const auth0Id = user?.sub;

            if (!auth0Id) {
                setError("Unable to retrieve Auth0 ID.");
                return;
            }

            const response = await fetch('http://localhost:8080/api/checkout/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ tier, auth0Id }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                setError("Stripe session creation failed.");
            }

        } catch (err) {
            console.error("Stripe session creation failed", err);
            setError("Unable to initiate payment.");
        }
    };


    return (
        <div>
            <div className="tier-buttons">
                {tiers.map(tier => {
                    const isCurrent = tier === currentTier;
                    return (
                        <button
                            key={tier}
                            disabled={loading || isCurrent}
                            onClick={() => {
                                if (tier === "Free") {
                                    handleUpgrade(tier);
                                } else {
                                    purchase(tier);
                                }
                            }}
                            className={`tier-button ${isCurrent ? 'current-tier' : ''}`}
                        >
                            {isCurrent && <span className="tier-badge">Current Plan</span>}

                            <h3 className="tier-title">{tier}</h3>
                            <ul className="tier-description-list">
                                {tier === "Free" && (
                                    <>
                                        <li>Basic access</li>
                                        <li>5 lessons per project</li>
                                        <li>Community support</li>
                                    </>
                                )}
                                {tier === "Professional" && (
                                    <>
                                        <li>Everything in Free</li>
                                        <li>10 lessons per project</li>
                                        <li>Priority support</li>
                                        <li>Advanced analytics</li>
                                    </>
                                )}
                                {tier === "Ultimate" && (
                                    <>
                                        <li>Everything in Pro</li>
                                        <li>Unlimited lessons and projects</li>
                                        <li>AI-enhanced tools</li>
                                        <li>Dedicated account manager</li>
                                    </>
                                )}
                            </ul>
                        </button>
                    );
                })}
            </div>
            {modalMessage && (
                <div className="tier-modal-overlay">
                    <div className="tier-modal">
                        <p>{modalMessage}</p>
                        <button onClick={() => setModalMessage(null)}>Close</button>
                    </div>
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default TierUpgrade;