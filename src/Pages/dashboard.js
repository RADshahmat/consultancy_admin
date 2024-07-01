import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../Auth/AxiosInstance';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import '../Styles/admindashboard.css';

const Dashboard = () => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [weekDates, setWeekDates] = useState([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState({});

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/timeslotsdashboard');
            setTimeSlots(response.data);
            calculateWeekDates(weekOffset);
            fetchTodayAppointments();
            fetchMonthlyStats();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [weekOffset]);

    const calculateWeekDates = (offsetWeeks = 0) => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const offset = dayOfWeek === 6 ? -1 : -((dayOfWeek + 1) % 7);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + offset + offsetWeeks * 7);
        const dates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
        setWeekDates(dates);
    };

    const handlePreviousWeek = () => {
        setWeekOffset((prev) => prev - 1);
        setSelectedAppointment(null);
        setSelectedCell(null);
    };

    const handleNextWeek = () => {
        setWeekOffset((prev) => prev + 1);
        setSelectedAppointment(null);
        setSelectedCell(null);
    };

    const handleAppointmentClick = (appointment, rowIndex, colIndex) => {
        setSelectedAppointment(appointment);
        setSelectedCell({ rowIndex, colIndex });
    };

    const fetchTodayAppointments = async () => {
        try {
            const response = await axiosInstance.get('/todayappointments');
            setTodayAppointments(response.data);
        } catch (error) {
            console.error('Error fetching today appointments:', error);
        }
    };

    const fetchMonthlyStats = async () => {
        try {
            const response = await axiosInstance.get('/monthlystats');
            setMonthlyStats(response.data);
        } catch (error) {
            console.error('Error fetching monthly statistics:', error);
        }
    };

    const cancelReservation = async (appointmentId) => {
        const confirmed = window.confirm('Are you sure you want to cancel this reservation?');
        if (confirmed) {
            try {
                const response = await axiosInstance.delete(`/cancelappointment/${appointmentId}`);
                if (response.status === 200) {
                    alert('Reservation cancelled successfully');
                    setSelectedAppointment(null);
                    fetchData(); // Refresh the data after cancelling the appointment
                }
            } catch (error) {
                console.error('Error cancelling reservation:', error);
                alert('Failed to cancel reservation');
            }
        }
    };

    return (
        <div>
            <table className="schedule">
                <thead>
                    <tr>
                        <th>Time Slot</th>
                        {weekDates.map((date, index) => (
                            <th key={index}>
                                {date.toLocaleDateString('en-US', { weekday: 'long' })}
                                <br />
                                {date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((slot, rowIndex) => (
                        <tr key={slot.slot_id}>
                            <td>{slot.time_slot}</td>
                            {weekDates.map((date, colIndex) => {
                                const appointment = slot.appointments.find(
                                    (appt) =>
                                        new Date(appt.appoint_date).toDateString() === date.toDateString()
                                );
                                const isSelected =
                                    selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex;
                                return (
                                    <td
                                        key={colIndex}
                                        className={appointment ? 'reserved' : ''}
                                        onClick={() => handleAppointmentClick(appointment, rowIndex, colIndex)}
                                        style={{ backgroundColor: isSelected ? '#4486b9' : '' }}
                                    >
                                        {appointment ? (
                                            <div className="cell-content">
                                                {appointment.user_fullname.length > 10 ? (
                                                    `${appointment.user_fullname.substring(0, 10)}...`
                                                ) : (
                                                    appointment.user_fullname
                                                )}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="navigation-buttons">
                <button className="nav2-button" onClick={handlePreviousWeek}>
                    <FaArrowAltCircleLeft className='nav2-btn-icon' /> Previous Week
                </button>
                <button className="nav2-button" onClick={handleNextWeek}>
                    Next Week<FaArrowAltCircleRight className='nav2-btn-icon' />
                </button>
            </div>
            <h3>You Have {todayAppointments.length} Reservations Today</h3>
            <div className="reservation-details">
                {selectedAppointment && (
                    <div className="reservation-card">
                        <p>Name: {selectedAppointment.user_fullname}</p>
                        <p>Phone: {selectedAppointment.user_phonenum}</p>
                        <p>{selectedAppointment.package_name}</p>
                        <p style={{ color: 'red' }}>{selectedAppointment.appoint_type} Meeting</p>
                        <p>Appointment ID: {selectedAppointment.appointment_id}</p>
                        <p>Booking Time: {selectedAppointment.time_slot}</p>
                        <p>Booking Date: {new Date(selectedAppointment.appoint_date).toLocaleDateString()}</p>
                        <div>
                            <button onClick={() => cancelReservation(selectedAppointment.appointment_id)}>Cancel This Reservation</button>
                            <Link
                                to={`/promotion?phone=${selectedAppointment.user_phonenum}&fullname=${encodeURIComponent(selectedAppointment.user_fullname)}`}
                            >
                                <img src={`${process.env.PUBLIC_URL}/sms-tracking.svg`} alt="Send SMS" />
                            </Link>
                        </div>
                    </div>
                )}
                <div className="reserv-result">
                    <p>Total Users: {monthlyStats.totalusers}</p>
                    <p>Last Month Users: {monthlyStats.lastmonthusers}</p> <br />
                    <p>This Month Reservations: {monthlyStats.thismonthreservations}</p>
                    <p>Last Month Reservations: {monthlyStats.lastmonthreservations}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
