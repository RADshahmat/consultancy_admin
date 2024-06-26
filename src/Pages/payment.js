import React, { useState } from 'react';
import '../Styles/payment.css';

const Payment = () => {
    const [sms, setSms] = useState('');
    const [sendById, setSendById] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
        // Handle the form submission logic here
        console.log({ sms, sendById, fromDate, toDate, message });
    };

    return (
        <div className="payment-form-container">
                <div className="payment-form-group label-name">
                    <label>Search By Name :</label>
                    <input type="text" value={sms} onChange={(e) => setSms(e.target.value)} />
                </div>
                <div className="payment-form-group label-id">
                    <label>Search By ID:</label>
                    <select value={sendById} onChange={(e) => setSendById(e.target.value)}>
                        <option value="">Select ID</option>
                        <option value="id1">ID 1</option>
                        <option value="id2">ID 2</option>
                        <option value="id3">ID 3</option>
                    </select>
                </div>

            <div className="payment-form-group">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
        </div>
    );
};

export default Payment;
