import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contractHelpers'

const DigiScribeContext = createContext();

export const DigiScribeProvider = ({ children }) => {
    const { signer, account } = useWallet();
    const [contract, setContract] = useState(null);
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize contract when signer is available
    useEffect(() => {
        if (signer) {
            const contractInstance = new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );
            setContract(contractInstance);
            refreshUserData();
        }
    }, [signer]);

    // Helper function to refresh user data
    const refreshUserData = async () => {
        if (contract && account) {
            try {
                const subs = await contract.getUserSubscriptions(account);
                const points = await contract.getUserRewardPoints(account);
                setUserSubscriptions(subs);
                setRewardPoints(points.toNumber());
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data');
            }
        }
    };

    // Contract interaction functions
    const createSubscription = async (serviceName, amount, frequency, paymentToken) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await contract.createSubscription(
                serviceName,
                ethers.utils.parseEther(amount.toString()),
                frequency,
                paymentToken,
                 {gasLimit: 300000 }
            );
            await tx.wait();
            await refreshUserData();
            return true;
        } catch (error) {
            console.error('Error creating subscription:', error);
            setError('Failed to create subscription');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const cancelSubscription = async (subIndex) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await contract.cancelSubscription(subIndex);
            await tx.wait();
            await refreshUserData();
            return true;
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            setError('Failed to cancel subscription');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const processPayment = async (subIndex) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await contract.processPayment(subIndex);
            await tx.wait();
            await refreshUserData();
            return true;
        } catch (error) {
            console.error('Error processing payment:', error);
            setError('Failed to process payment');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const claimRewards = async () => {
        setLoading(true);
        setError(null);
        try {
            const tx = await contract.claimRewards();
            await tx.wait();
            await refreshUserData();
            return true;
        } catch (error) {
            console.error('Error claiming rewards:', error);
            setError('Failed to claim rewards');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Service registration (admin only)
    const registerService = async (serviceName, serviceWallet) => {
        setLoading(true);
        setError(null);
        try {
            const tx = await contract.registerService(serviceName, serviceWallet);
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Error registering service:', error);
            setError('Failed to register service');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Utility functions
    const getSubscriptionDetails = async (subIndex) => {
        try {
            return userSubscriptions[subIndex];
        } catch (error) {
            console.error('Error getting subscription details:', error);
            setError('Failed to get subscription details');
            return null;
        }
    };

    const formatSubscriptionData = (subscription) => {
        return {
            serviceName: subscription.serviceName,
            amount: ethers.utils.formatEther(subscription.amount),
            frequency: subscription.frequency.toNumber(),
            lastPayment: new Date(subscription.lastPayment.toNumber() * 1000),
            nextPayment: new Date(subscription.nextPayment.toNumber() * 1000),
            active: subscription.active,
            paymentToken: subscription.paymentToken
        };
    };

    // Event listeners
    useEffect(() => {
        if (contract) {
            const subscriptionCreated = (user, serviceName, amount) => {
                if (user === account) {
                    refreshUserData();
                }
            };

            const paymentProcessed = (user, serviceName, amount) => {
                if (user === account) {
                    refreshUserData();
                }
            };

            contract.on('SubscriptionCreated', subscriptionCreated);
            contract.on('PaymentProcessed', paymentProcessed);

            return () => {
                contract.off('SubscriptionCreated', subscriptionCreated);
                contract.off('PaymentProcessed', paymentProcessed);
            };
        }
    }, [contract, account]);

    const contextValue = {
        contract,
        userSubscriptions,
        rewardPoints,
        loading,
        error,
        createSubscription,
        cancelSubscription,
        processPayment,
        claimRewards,
        registerService,
        getSubscriptionDetails,
        formatSubscriptionData,
        refreshUserData
    };

    return (
        <DigiScribeContext.Provider value={contextValue}>
            {children}
        </DigiScribeContext.Provider>
    );
};

export const useDigiScribe = () => {
    const context = useContext(DigiScribeContext);
    if (!context) {
        throw new Error('useDigiScribe must be used within a DigiScribeProvider');
    }
    return context;
};