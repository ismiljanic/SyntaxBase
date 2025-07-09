import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import TierUpgrade from '../../components/instructor/TierUpgrade';
import '../../styles/TierUpgrade.css';
import { Header } from '../Header';
import { Footer2 } from '../Footer2';
import { Footer } from '../Footer';

type Tier = "Free" | "Professional" | "Ultimate";

const TierUpgradePage: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [userTier, setUserTier] = useState<Tier | null>(null);

    useEffect(() => {
        const fetchUserTier = async () => {
            if (!user) return;
            const token = await getAccessTokenSilently();
            try {
                const response = await fetch('http://localhost:8080/api/users/userInformation', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                const normalizedTier = normalizeTier(data.tier);
                setUserTier(normalizedTier);
            } catch (error) {
                console.error("Failed to fetch user tier", error);
            }
        };

        fetchUserTier();
    }, [user]);

    const normalizeTier = (tier: string): Tier => {
        const t = tier.toLowerCase();
        if (t === "free") return "Free";
        if (t === "professional") return "Professional";
        if (t === "ultimate") return "Ultimate";
        return "Free";
    };

    return (
        <div>
            <Header bgColor='#f6f6f6'></Header>
            <div className='tierContainer'>
                <h1 className="tierHeading">Upgrade Your Account Tier</h1>
                {userTier ? (
                    <TierUpgrade
                        currentTier={userTier}
                        onUpgrade={(newTier) => setUserTier(newTier)}
                    />
                ) : (
                    <p>Loading your current tier...</p>
                )}
            </div>
            <Footer2 bgColor='#f6f6f6'/>
            <Footer bgColor='#f6f6f6'/>
        </div>
    );
};

export default TierUpgradePage;