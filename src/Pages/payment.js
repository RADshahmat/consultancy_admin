import React, { useState, useEffect } from 'react';
import '../Styles/payment.css';
import axiosInstance from '../Auth/AxiosInstance'; 

const Payment = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentResults, setPaymentResults] = useState([]);

    useEffect(() => {
        const fetchInitialPayments = async () => {
            try {
                const response = await axiosInstance.get('/payments');
                if (response.data && response.data.length > 0) {
                    setPaymentResults(response.data);
                } else {
                    setPaymentResults([]);
                }
            } catch (error) {
                console.error('Error fetching payment details:', error);
                setPaymentResults([]);
            }
        };

        fetchInitialPayments();
    }, []);

    const handleSearch = async (searchTerm) => {
        try {
            const response = await axiosInstance.get(`/payments?search=${searchTerm || ''}`);
            if (response.data && response.data.length > 0) {
                setPaymentResults(response.data);
            } else {
                setPaymentResults([]);
            }
        } catch (error) {
            console.error('Error fetching payment details:', error);
            setPaymentResults([]);
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        handleSearch(value);
    };

    return (
        <div className="payment-form-container">
            <div className="payment-form-group label-name">
                <label>Search By Name/Phone Number:</label>
                <input type="text" value={searchTerm} onChange={handleChange} />
            </div>
            <div className="payment-result-container">
                {paymentResults.length > 0 ? (
                    paymentResults.map((payment, index) => (
                        <div key={index} className="payment-card">
                            <div>
                                {payment.user_fullname} - Phone: {payment.user_phonenum} - Received {payment.amount} Taka for {payment.package_name}
                            </div>
                            <div className="payment-date-time">
                                {payment.payment_date} at {payment.payment_time}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">No payment details found.</div>
                )}
            </div>
        </div>
    );
};

export default Payment;
