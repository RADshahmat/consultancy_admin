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
                <div className="payment-form-group">
                    <label>Send SMS :</label>
                    <input type="text" value={sms} onChange={(e) => setSms(e.target.value)} />
                </div>
                <div className="payment-form-group">
                    <label>Send By ID:</label>
                    <input type="text" value={sendById} onChange={(e) => setSendById(e.target.value)} />
                </div>
            <div className="payment-form-group">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
        </div>
    );
};

export default Payment;
