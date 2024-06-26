import React, { useState } from 'react';
import '../Styles/changepassword.css';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        // Handle password change logic here
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);
    };

    return (
        <div className="change-password-container">
                            <h2 className='cng-pass-header'>Change Password</h2>

            <form onSubmit={handlePasswordChange} className="change-password-form">
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
                <button type="submit" className="change-password-button">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
