import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import '../Styles/permission.css';

const Permission = () => {
    const [sms, setSms] = useState('');
    const [sendById, setSendById] = useState('');
    const [message, setMessage] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const handlePermissionClick = (permission) => {
        setSelectedPermissions(prevSelected =>
            prevSelected.includes(permission)
                ? prevSelected.filter(item => item !== permission)
                : [...prevSelected, permission]
        );
    };

    const handleUpdate = () => {
        // Handle the update logic here
        console.log('Selected Permissions:', selectedPermissions);
    };

    const permissionsList = ["Dashboard", "Appointment", "Payment", "Package", "Promotion", "Permission"];

    const handleSend = () => {
        // Handle the form submission logic here
        console.log({ sms, sendById, message });
    };

    return (
        <div className="permission-form-container">
            <div className='permission-leftdiv'>
                <div className="permission-account">
                    <label>Create Account</label>
                    <input type="text" value={sms} placeholder=' Username' onChange={(e) => setSms(e.target.value)} />
                    <input type="text" value={sendById} placeholder=' Password' onChange={(e) => setSendById(e.target.value)} />
                    <div>
                        <button onClick={handleSend} className="create-button">Create</button>
                    </div>
                </div>
                <div className='permissions'>
                    <div className='permissions-type-container'>
                        <p>Permission for Rad Shahmat</p>
                        <div className='permissions-category'>
                            {permissionsList.map(permission => (
                                <p
                                    key={permission}
                                    className={selectedPermissions.includes(permission) ? 'selected' : ''}
                                    onClick={() => handlePermissionClick(permission)}
                                >
                                    {permission}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className='upd-btn-container'>
                        <button onClick={handleUpdate} className="update-button">Update</button>
                    </div>
                </div>
            </div>
            <div className='perm-right'>
                <p>Users</p>
                <div className='permission-rightdiv'>
                    <p className='p-card'>
                        <span className='card-name'>Rad Shahmat</span>
                        <FaUser className='card-icon' />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Permission;
