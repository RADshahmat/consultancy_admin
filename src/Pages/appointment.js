import React, { useState } from 'react';
import styles from '../Styles/appointment.module.css';
import { FaCalendarAlt, FaClock, FaUser, FaArrowRight } from 'react-icons/fa';

const Appointment = () => {
    const [appointmentType, setAppointmentType] = useState('online'); // 'online' or 'inPerson'

    const handleTypeChange = (type) => {
        setAppointmentType(type);
    };

    return (
        <div className={styles.login}>
            <br/><br/>
            <h3>Book An Appointment</h3>
            <br/>
            <form className={styles.appointmentForm}>
                <div className={styles.formGroup}>
                    <label>Your Full Name</label>
                    <div className={styles.inputGroup}>
                        <input type="text" placeholder="Write Your Full Name (As Per NID)" />
                        <FaUser className={styles.icon} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Counselling Type</label>
                    <div className={styles.inputGroup}>
                        <select style={{width:"98%"}}>
                            <option>Individual Counselling - 3000 Taka</option>
                            <option>Couple Counselling - 5000 Taka</option>
                        </select>
                    </div>
                </div>

                <div className="formGroup">
                    <label>Preferred Date</label>
                    <div className={styles.inputGroup}>
                        <input type="date" />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Preferred Time Slot</label>
                    <div className={styles.inputGroup}>
                        <input type="text" />
                        <FaClock className={styles.icon} />
                    </div>
                </div>

                <div className={`${styles.formGroup} ${styles.appointmentType}`}>
                    <label>Appointment Type</label>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={`${styles.online} ${appointmentType === 'online' ? styles.selected : ''}`}
                            onClick={() => handleTypeChange('online')}
                        >
                            Online
                        </button>
                        <button
                            type="button"
                            className={`${styles.inPerson} ${appointmentType === 'inPerson' ? styles.selected : ''}`}
                            onClick={() => handleTypeChange('inPerson')}
                        >
                            In Person
                        </button>
                    </div>
                </div>

                <button type="submit" className={styles.paymentButton}>
                    Confirm Now <FaArrowRight className={styles.arrowIcon} />
                </button>
            </form>
        </div>
    );
};

export default Appointment;
