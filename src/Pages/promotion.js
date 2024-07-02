import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/promotionform.css';

const PromotionForm = () => {
    const [sms, setSms] = useState('');
    const [sendById, setSendById] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [message, setMessage] = useState('');

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const phoneParam = params.get('phone');
    const phone = phoneParam ? `+${phoneParam.replace(' ', '')}` : '';
    const fullname = params.get('fullname');

    useEffect(() => {
        if (phone) {
            setSms(decodeURIComponent(phone));
        }
    }, [phone]);

    const handleSend = () => {
        console.log({ sms, sendById, fromDate, toDate, message });
    };

    return (
        <div className="promotion-form">
            <div className="form-gr">
                <label>Send SMS :</label>
                <input type="text" value={sms} onChange={(e) => setSms(e.target.value)} />
            </div>
            <div className="form-gr">
                <label>Send By ID:</label>
                <select value={sendById} onChange={(e) => setSendById(e.target.value)}>
                    <option value="">Select ID</option>
                    <option value="id1">ID 1</option>
                    <option value="id2">ID 2</option>
                    <option value="id3">ID 3</option>
                </select>
            </div>
            <div className="form-group">
                <label>Bulk User By Date:</label>
                <div className="date-range">
                    <div>
                        <label>From:</label>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </div>
                    <div>
                        <label>To:</label>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="form-group message-group">
                <textarea value={message} placeholder='1921/1 Character' onChange={(e) => setMessage(e.target.value)} />
                <button onClick={handleSend} className="send-button">Send <img src={`${process.env.PUBLIC_URL}/send.svg`} alt="Send" /></button>
            </div>
        </div>
    );
};

export default PromotionForm;
