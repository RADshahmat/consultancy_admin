import React, { useState, useEffect } from 'react';
import styles from '../Styles/appointment.module.css';
import axiosInstance from '../Auth/AxiosInstance';
import { FaCalendarAlt, FaClock, FaUser, FaArrowRight, FaPhone } from 'react-icons/fa';

const Appointment = () => {
    const [appointmentType, setAppointmentType] = useState('Online'); 
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axiosInstance.get('/package');
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    const fetchTimeSlots = async (date) => {
        try {
            const response = await axiosInstance.get(`/timeslots?date=${date}`);
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching time slots:', error);
        }
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        if (date) {
            fetchTimeSlots(date);
        }
    };

    const handleTypeChange = (type) => {
        setAppointmentType(type);
    };

    const handlePhoneNumberChange = (e) => {
        let input = e.target.value.replace(/^\+880/, '');
        if (input.length === 11 && input.startsWith('0')) {
            input = input.slice(1);
        }
        setPhoneNumber(input.slice(0, 11));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/appointment', {
                package_id: selectedPackage,
                appoint_type: appointmentType,
                appoint_date: selectedDate,
                user_fullname: fullName,
                user_phonenum: '+880' + phoneNumber,
                slot_id: selectedTimeSlot
            });
            alert('Appointment booked successfully');
            setFullName('');
            setPhoneNumber('');
            setSelectedPackage('');
            setSelectedDate('');
            setSelectedTimeSlot('');
            setTimeSlots([]);
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.login}>
            <br /><br />
            <h3>Book An Appointment</h3>
            <br />
            <form className={styles.appointmentForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Your Full Name</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Write Your Full Name (As Per NID)"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <FaUser className={styles.icon} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Your Phone Number</label>
                    <div className={styles.inputGroup}>
                        <span className={styles.prefix}>+880</span>
                        <input className='phone_input'
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            maxLength="11"
                            style={{ paddingLeft: '50px' }}
                        />
                        <FaPhone className={styles.icon} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Counselling Type</label>
                    <div className={styles.inputGroup}>
                        <select
                            style={{ width: "98%" }}
                            value={selectedPackage}
                            onChange={(e) => setSelectedPackage(e.target.value)}
                        >
                            <option value="">Select a package</option>
                            {packages.map(pkg => (
                                <option key={pkg._id} value={pkg._id}>
                                    {pkg.name} - {pkg.price} Taka
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Preferred Date</label>
                    <div className={styles.inputGroup}>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Preferred Time Slot</label>
                    <div className={styles.inputGroup}>
                        <select
                            style={{ width: "98%" }}
                            value={selectedTimeSlot}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        >
                            <option value="">Select a time slot</option>
                            {timeSlots.map(slot => (
                                <option key={slot.slot_id} value={slot.slot_id}>
                                    {slot.time_slot}
                                </option>
                            ))}
                        </select>
                        <FaClock className={styles.icon} />
                    </div>
                </div>

                <div className={`${styles.formGroup} ${styles.appointmentType}`}>
                    <label>Appointment Type</label>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={`${styles.online} ${appointmentType === 'Online' ? styles.selected : ''}`}
                            onClick={() => handleTypeChange('Online')}
                        >
                            Online
                        </button>
                        <button
                            type="button"
                            className={`${styles.inPerson} ${appointmentType === 'In Person' ? styles.selected : ''}`}
                            onClick={() => handleTypeChange('In Person')}
                        >
                            In Person
                        </button>
                    </div>
                </div>

                <button type="submit" className={styles.paymentButton} disabled={loading}>
                    {loading ? "Confirming..." : "Confirm Now"} <FaArrowRight className={styles.arrowIcon} />
                </button>
            </form>
        </div>
    );
};

export default Appointment;
