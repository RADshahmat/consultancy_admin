import React, { useState, useEffect } from 'react';
import axiosInstance from '../Auth/AxiosInstance';
import styles from '../Styles/EditReservationModal.module.css';

const EditReservationModal = ({ isOpen, onClose, appointment, onUpdate }) => {
    const [date, setDate] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const fetchTimeSlots = async (date) => {
        try {
           
            const response = await axiosInstance.get(`/timeslots?date=${date}`);
            console.log('this is the date',response)
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching time slots:', error);
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);
        if (selectedDate) {
            fetchTimeSlots(selectedDate);
        }
    };
    

    const handelClose = async () => {
        onClose()
        setSuccess(false);
    }
    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/updateappointment?appointment_id=${appointment.appointment_id}`, { date, timeSlot: selectedTimeSlot });
            if (response.status === 200) {
                setSuccess(true);
                onUpdate();
            }
        } catch (error) {
            console.error("Error updating reservation:", error);
        } finally {
            setLoading(false);
        }
    };
    //console.log('appoinment',appointment)

    return (
        isOpen && (
            <div className={styles['modal-overlay']}>
                <div className={styles['modal-content']}>
                    {success ? (
                        <div>
                            <p className={styles['success-message']}>Updated successfully</p>
                            <button className={styles['success-button']} onClick={handelClose}>Okay</button>
                        </div>
                    ) : (
                        <div>
                            <h3>Edit Reservation</h3>
                            <label>Date:</label>
                            <input type="date" value={date} onChange={handleDateChange} />
                            <label>Time Slot:</label>
                            <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)}>
                                <option value="">Select a time slot</option>
                                {timeSlots.map((slot) => (
                                    <option key={slot.slot_id} value={slot.slot_id}>
                                        {slot.time_slot}
                                    </option>
                                ))}
                            </select>
                            <div className={styles['modal-buttons']}>
                                <button onClick={onClose}>Cancel</button>
                                <button onClick={handleConfirm}>
                                    {loading ? 'Loading...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default EditReservationModal;
