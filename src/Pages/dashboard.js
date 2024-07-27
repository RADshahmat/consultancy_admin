import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../Auth/AxiosInstance";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import EditReservationModal from './EditReservationModal'; // Import the modal component
import "../Styles/admindashboard.css";

const Dashboard = () => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [weekDates, setWeekDates] = useState([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState({});
    const [blockedCells, setBlockedCells] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPermitted,setIsPermited]=useState(false);
    const [isPermitted1,setIsPermited1]=useState(false);

    
 
    const fetchData = async () => {
        try {
            
            const response = await axiosInstance.get("/timeslotsdashboard");
            console.log('dddddddddddddddd',response.data)
            setTimeSlots(response.data);
            calculateWeekDates(weekOffset);
            fetchTodayAppointments();
            fetchMonthlyStats();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchBlockedCells = async () => {
        
        try {
            console.log('hhhhhhhhhhhhhhhhhh')
            const response = await axiosInstance.get("/blockedCells");
            console.log('this is blocked cells',response.data);
            setBlockedCells(response.data);
        } catch (error) {
            console.error("Error fetching blocked cells:", error);
        }
    };
    
    useEffect(()=>{
       fetchBlockedCells();
        
    },[])
    useEffect(() => {
        setIsPermited(localStorage.getItem('dashboardPermission'))
        setIsPermited1(localStorage.getItem('dashboardPermission1'))
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

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const handleAppointmentClick = async (appointment, rowIndex, colIndex, date, timeSlot) => {
        setSelectedAppointment(appointment);
        setSelectedCell({ rowIndex, colIndex });
        const formatedDate = formatDate(date);
        if (!appointment) {
            try {
                if(isPermitted=='false'){
                    return;
                  }
               
                const res=await axiosInstance.post("/blockCells", { formatedDate, timeSlot });
                
                fetchBlockedCells();
            } catch (error) {
                console.error("Error blocking/unblocking cell:", error);
            }
        }
    };

    const fetchTodayAppointments = async () => {
        try {
            const response = await axiosInstance.get("/todayappointments");
            console.log(response.data)
            setTodayAppointments(response.data);
        } catch (error) {
            console.error("Error fetching today appointments:", error);
        }
    };

    const fetchMonthlyStats = async () => {
        try {
            const response = await axiosInstance.get("/monthlystats");
            
            setMonthlyStats(response.data[0]);
        } catch (error) {
            console.error("Error fetching monthly statistics:", error);
        }
    };

    const cancelReservation = async (appointmentId) => {
        if(isPermitted=='false'){
            return;
          }
        const confirmed = window.confirm("Are you sure you want to cancel this reservation?");
        if (confirmed) {
            try {
                const response = await axiosInstance.delete(`/cancelappointment/${appointmentId}`);
                if (response.status === 200) {
                    alert("Reservation cancelled successfully");
                    setSelectedAppointment(null);
                    fetchData();
                }
            } catch (error) {
                console.error("Error cancelling reservation:", error);
                alert("Failed to cancel reservation");
            }
        }
    };

    const handleHeaderClick = async (date) => {
        if(isPermitted=='false'){
          return;
        }
        const formatedDate = formatDate(date);
        
        const response = await axiosInstance.post('/blockDay', { formatedDate });
        fetchBlockedCells();
    };

    const isBlocked = (date, timeSlot) => {
        const blockedCell = blockedCells.find(
            (cell) => new Date(cell.schedule_date).toDateString() === date.toDateString()
        );
        if (!blockedCell) return false;
        const timeSlotMapping = {
            '9:00 AM - 10:00 AM': blockedCell.time_slot1.trim(),
            '10:15 AM - 11:15 AM': blockedCell.time_slot2.trim(),
            '11:30 AM - 12:30 PM': blockedCell.time_slot3.trim(),
            '12:45 PM - 1:45 PM': blockedCell.time_slot4.trim(),
            '2:00 PM - 3:00 PM': blockedCell.time_slot5.trim(),
            '3:15 PM - 4:15 PM': blockedCell.time_slot6.trim(),
            '4:30 PM - 5:30 PM': blockedCell.time_slot7.trim(),
            '7:00 PM - 8:00 PM': blockedCell.time_slot8.trim(),
            '8:15 PM - 9:15 PM': blockedCell.time_slot9.trim()
        };
        return timeSlotMapping[timeSlot] === '1';
    };

    const openEditModal = () => {
        if(isPermitted=='false'){
            return;
          }
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        if(isPermitted=='false'){
            return;
          }
        setIsModalOpen(false);
    };

    const handleUpdate = () => {
        fetchData();
        //closeEditModal();
    };
 
    return (
        <div>
            <table className="schedule">
                <thead>
                    <tr>
                        <th>Time Slot</th>
                        {weekDates.map((date, index) => (
                            <th key={index} onClick={() => handleHeaderClick(date)} style={{ cursor: 'pointer' }}>
                                {date.toLocaleDateString("en-US", { weekday: "long" })}
                                <br />
                                {date.toLocaleDateString("en-US", { day: "numeric", month: "long" })}
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
                                    (appt) => new Date(appt.appoint_date).toDateString() === date.toDateString()
                                );
                                const isSelected =
                                    selectedCell &&
                                    selectedCell.rowIndex === rowIndex &&
                                    selectedCell.colIndex === colIndex;
                                const isCellBlocked = isBlocked(date, slot.time_slot);
                                return (
                                    <td
                                        key={colIndex}
                                        className={appointment ? "reserved" : ""}
                                        style={{
                                            backgroundColor: isCellBlocked ? "rgb(220, 20, 60)" : "",
                                            transition: "background-color 0.4s ease"
                                        }}
                                        onClick={() =>
                                            handleAppointmentClick(appointment, rowIndex, colIndex, date, slot.time_slot)
                                        }

                                    >
                                        {appointment ? (
                                            <div className="cell-content">
                                                {appointment.user_fullname.length > 10
                                                    ? `${appointment.user_fullname.substring(0, 10)}...`
                                                    : appointment.user_fullname}
                                            </div>
                                        ) : (
                                            ""
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
                    <FaArrowAltCircleLeft className="nav2-btn-icon" /> Previous Week
                </button>
                <button className="nav2-button" onClick={handleNextWeek}>
                    Next Week
                    <FaArrowAltCircleRight className="nav2-btn-icon" />
                </button>
            </div>
            <h3>You Have {todayAppointments.length} Reservations Today</h3>
            <div className="reservation-details">
                {selectedAppointment && (
                    <div className="reservation-card">
                        <p>Name: {selectedAppointment.user_fullname}</p>
                        <p>Phone: {selectedAppointment.user_phonenum}</p>
                        <p>{selectedAppointment.package_name}</p>
                        <p style={{ color: "red" }}>{selectedAppointment.appoint_type} Meeting</p>
                        <p>Appointment ID: {selectedAppointment.appointment_id}</p>
                        <p>Booking Time: {selectedAppointment.time_slot}</p>
                        <p>Booking Date: {new Date(selectedAppointment.appoint_date).toLocaleDateString()}</p>
                        <div>
                            <button
                                style={{ fontSize: '.85rem', background: 'black', color: 'white', borderRadius: '5px', padding: '5px 7px' }}
                                onClick={() => cancelReservation(selectedAppointment.appointment_id)}
                            >
                                Cancel Reservation
                            </button>
                            <button
                                style={{ fontSize: '.85rem', background: 'black', color: 'white', borderRadius: '5px', padding: '5px 7px' }}
                                onClick={openEditModal}
                            >
                                Edit Reservation
                            </button>
                            {isPermitted1=='true'?<Link
                                to={`/dashboard/promotion?phone=${selectedAppointment.user_phonenum}&fullname=${encodeURIComponent(selectedAppointment.user_fullname)}`}
                            >
                                <img src={`${process.env.PUBLIC_URL}/sms-tracking.svg`} alt="Send SMS" />
                            </Link>:''}
                        </div>
                    </div>
                )}
                <div className="reserv-result">
                    <p>Total Users: {monthlyStats.totalUsers}</p>
                    <p>Last Month Users: {monthlyStats.lastMonthUsers}</p> <br />
                    <p>This Month Reservations: {monthlyStats.thisMonthReservations}</p>
                    <p>Last Month Reservations: {monthlyStats.lastMonthReservations}</p>
                </div>
            </div>
            <EditReservationModal
                isOpen={isModalOpen}
                onClose={closeEditModal}
                appointment={selectedAppointment}
                onUpdate={handleUpdate}
            />
        </div>
    );
};

export default Dashboard;
