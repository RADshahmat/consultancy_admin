import React, { useState } from 'react';
import '../Styles/changepassword.css';
import axiosInstance from '../Auth/AxiosInstance';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            setTimeout(() => setError(''), 2000); 
            return;
        }

        try {
            const response = await axiosInstance.post('/changepassword', {
                currentPassword,
                newPassword,
            });

            if (response.data.success) {
                setSuccess('Password changed successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setSuccess(''), 2000); 
            } else {
                setError('Failed to change password.');
                setTimeout(() => setError(''), 2000); 
            }
        } catch (error) {
            setError('An error occurred while changing the password.');
            console.error('Error:', error);
            setTimeout(() => setError(''), 2000); 
        }
    };

    return (
        <div className="change-password-container">
            <h2 className="cng-pass-header">Change Password</h2>
            <form onSubmit={handleSubmit} className="change-password-form">
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    className="password-input"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="password-input"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="password-input"
                />
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <button type="submit" className="change-password-button">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
