import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../Styles/appointment.module.css";
import axiosInstance from "../Auth/AxiosInstance";
import { FaCalendarAlt, FaClock, FaUser, FaArrowRight, FaCaretDown, FaPhone } from "react-icons/fa";

const Appointment = () => {
    const [appointmentType, setAppointmentType] = useState('Online');
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [isBangladesh, setIsBangladesh] = useState(false);
    const datePickerRef = useRef(null);
    const packageSelectRef = useRef(null);

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

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
            const formattedDate = formatDate(date);
            fetchTimeSlots(formattedDate);
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    };

    const handleTypeChange = (type) => {
        setAppointmentType(type);
    };

    const handlePhoneNumberChange = (value, country) => {
        setPhoneNumber(value);
        setIsBangladesh(country.countryCode === 'bd');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const bdDate = formatDate(selectedDate); // Convert date to string in format YYYY-MM-DD
            await axiosInstance.post('/appointment', {
                package_id: selectedPackage,
                appoint_type: appointmentType,
                appoint_date: bdDate,
                user_fullname: fullName,
                user_phonenum: '+' + phoneNumber,
                slot_id: selectedTimeSlot
            });
            alert('Appointment booked successfully');
            setFullName('');
            setPhoneNumber('');
            setSelectedPackage('');
            setSelectedDate(null);
            setSelectedTimeSlot('');
            setTimeSlots([]);
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const openDatePicker = () => {
        datePickerRef.current.setOpen(true);
    };

    const openPackageSelect = () => {
        packageSelectRef.current.focus();
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
                        <PhoneInput
                            country={'bd'}
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            enableSearch={true}
                            countryCodeEditable={false}
                            inputProps={{
                                name: 'phone',
                                required: true,
                                autoFocus: true,
                                className: styles.phoneInput
                            }}
                            containerClass={styles.customPhoneInput}
                            buttonClass={styles.customPhoneInput}
                            inputStyle={{ paddingLeft: '48px' }}
                        />
                        <FaPhone className={styles.icon} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Counselling Type</label>
                    <div className={styles.inputGroup}>
                        <select
                            value={selectedPackage}
                            onChange={(e) => setSelectedPackage(e.target.value)}
                            ref={packageSelectRef}
                        >
                            <option value="">Select a package</option>
                            {packages.map(pkg => (
                                <option key={pkg._id} value={pkg._id}>
                                    {pkg.name} - {isBangladesh ? `${pkg.price_inTaka} Taka` : `$${pkg.price_inDollar}`}
                                </option>
                            ))}
                        </select>
                        <FaCaretDown className={styles.icon} onClick={openPackageSelect} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Preferred Date</label>
                    <div className={styles.inputGroup}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className={styles.datePicker}
                            placeholderText="Select a date"
                            ref={datePickerRef}
                        />
                        <FaCalendarAlt className={styles.icon} onClick={openDatePicker} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Preferred Time Slot</label>
                    <div className={styles.inputGroup}>
                        <select
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
