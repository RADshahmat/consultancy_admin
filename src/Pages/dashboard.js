import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import Modal from 'react-modal';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
import axiosInstance from "../Auth/AxiosInstance";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import EditReservationModal from "./EditReservationModal"; // Import the modal component
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
  const [isPermitted, setIsPermited] = useState(false);
  const [isPermitted1, setIsPermited1] = useState(false);

  const [suggestionText, setSuggestionText] = useState('');
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  const handleSuggestionClick = (phoneNumber) => {
    // Open the editor when the paper icon is clicked
    setIsEditorVisible(true);
    // Optionally, fetch the existing suggestion based on the phone number
    fetchSuggestion(phoneNumber);
  };

  // Fetch the existing suggestion based on phone number (or appointment ID)
  const fetchSuggestion = async (phoneNumber) => {
    try {
      const response = await axiosInstance.get(`/suggestions/${phoneNumber}`);
      setSuggestionText(response.data.suggestion || ''); // Set the existing suggestion or empty
    } catch (error) {
      console.error('Error fetching suggestion:', error);
    }
  };

  // Function to handle text changes in the rich text editor
  const handleEditorChange = (value) => {
    setSuggestionText(value);
  };

  // Function to save the suggestion to the backend
  const saveSuggestion = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post('/suggestions', {
        suggestion: suggestionText,
        phone: selectedAppointment.user_phonenum,
      });
  
      // Show success toast notification
      toast.success('Suggestion saved successfully!', {
        position: "top-right", // Use string instead of toast.POSITION.TOP_RIGHT
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error saving suggestion:', error);
  
      // Show error toast notification
      toast.error('Failed to save suggestion.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const closeEditor = () => {
    setIsEditorVisible(false); // Close the editor modal
  };


  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/timeslotsdashboard");
      
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
      
      const response = await axiosInstance.get("/blockedCells");
      
      setBlockedCells(response.data);
    } catch (error) {
      console.error("Error fetching blocked cells:", error);
    }
  };

  useEffect(() => {
    fetchBlockedCells();
  }, []);
  useEffect(() => {
    setIsPermited(localStorage.getItem("dashboardPermission"));
    setIsPermited1(localStorage.getItem("dashboardPermission1"));
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
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const handleAppointmentClick = async (
    appointment,
    rowIndex,
    colIndex,
    date,
    timeSlot
  ) => {
    
    setSelectedAppointment(appointment);
    setSelectedCell({ rowIndex, colIndex });
    const formatedDate = formatDate(date);
    if (!appointment) {
      try {
        if (isPermitted === "false") {
          return;
        }

        const res = await axiosInstance.post("/blockCells", {
          formatedDate,
          timeSlot,
        });

        fetchBlockedCells();
      } catch (error) {
        console.error("Error blocking/unblocking cell:", error);
      }
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const response = await axiosInstance.get("/todayappointments");
      
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
    if (isPermitted === "false") {
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (confirmed) {
      try {
        const response = await axiosInstance.delete(
          `/cancelappointment/${appointmentId}`
        );
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
    if (isPermitted === "false") {
      return;
    }
    const formatedDate = formatDate(date);

    const response = await axiosInstance.post("/blockDay", { formatedDate });
    fetchBlockedCells();
  };

  const isBlocked = (date, timeSlot) => {
    const blockedCell = blockedCells.find(
      (cell) =>
        new Date(cell.schedule_date).toDateString() === date.toDateString()
    );
    if (!blockedCell) return false;
    const timeSlotMapping = {
      "9:00 AM - 10:00 AM": blockedCell.time_slot1.trim(),
      "10:15 AM - 11:15 AM": blockedCell.time_slot2.trim(),
      "11:30 AM - 12:30 PM": blockedCell.time_slot3.trim(),
      "12:45 PM - 1:45 PM": blockedCell.time_slot4.trim(),
      "2:00 PM - 3:00 PM": blockedCell.time_slot5.trim(),
      "3:15 PM - 4:15 PM": blockedCell.time_slot6.trim(),
      "4:30 PM - 5:30 PM": blockedCell.time_slot7.trim(),
      "7:00 PM - 8:00 PM": blockedCell.time_slot8.trim(),
      "8:15 PM - 9:15 PM": blockedCell.time_slot9.trim(),
    };
    return timeSlotMapping[timeSlot] === "1";
  };

  const openEditModal = () => {
    if (isPermitted === "false") {
      return;
    }
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    if (isPermitted === "false") {
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
              <th
                key={index}
                onClick={() => handleHeaderClick(date)}
                style={{ cursor: "pointer" }}
              >
                {date.toLocaleDateString("en-US", { weekday: "long" })}
                <br />
                {date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                })}
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
                    new Date(appt.appoint_date).toDateString() ===
                    date.toDateString()
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
                        background: appointment
                          ? appointment.duration === '1.5'
                            ? isCellBlocked
                              ? "#e63946" // Bright red
                              : "#93C572" // Soft cream
                            : isCellBlocked
                            ? "#e63946" // Bright red
                            : "#FFAA33" // Soft cream
                          : isCellBlocked
                          ? "#e63946" // Bright red
                          : "#ffffff", // White
                        transition: "background-color 0.4s ease",
                        borderBottom: appointment
                          ? appointment.duration === '1.5'
                            ? '1px solid #93C572' // Modern green
                            : 'none'
                          : 'none',
                      }}
                      
                      
                      
                    onClick={() =>
                      handleAppointmentClick(
                        appointment,
                        rowIndex,
                        colIndex,
                        date,
                        slot.time_slot
                      )
                    }
                  >
                    {appointment ? (
                      <div
                        className="cell-content"
                        style={
                          appointment.duration === "1.5"
                            ? { background: "#93C572" }
                            : { background: "#FFAA33" }
                        }
                      >
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
      <h3>
        {todayAppointments && todayAppointments.length > 0 
          ? `You Have ${todayAppointments.length} Reservations Today` 
          : 'You Have No Reservation Today'}
        </h3>

      <div className="reservation-details">
        {selectedAppointment && (
          <div className="reservation-card">
            <p>Name: {selectedAppointment.user_fullname}</p>
            <p>Phone: {selectedAppointment.user_phonenum}</p>
            <p>{selectedAppointment.package_name}</p>
            <p style={{ color: "red" }}>
              {selectedAppointment.appoint_type} Meeting
            </p>
            <p>Appointment ID: {selectedAppointment.appointment_id}</p>
            <p>Booking Time: {selectedAppointment.time_slot}</p>
            <p>
              Booking Date:{" "}
              {new Date(selectedAppointment.appoint_date).toLocaleDateString()}
            </p>
            <div>
              <button
                style={{
                  fontSize: ".85rem",
                  background: "black",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px 7px",
                }}
                onClick={() =>
                  cancelReservation(selectedAppointment.appointment_id)
                }
              >
                Cancel Reservation
              </button>
              <button
                style={{
                  fontSize: ".85rem",
                  background: "black",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px 7px",
                }}
                onClick={openEditModal}
              >
                Edit Reservation
              </button>
              <img src={`${process.env.PUBLIC_URL}/paper.png`} alt="Edit Suggestion"  onClick={() => handleSuggestionClick(selectedAppointment?.user_phonenum)} style={{ cursor: 'pointer' }} />

              {isPermitted1 === "true" ? (
                <Link
                  to={`/dashboard/promotion?phone=${
                    selectedAppointment.user_phonenum
                  }&fullname=${encodeURIComponent(
                    selectedAppointment.user_fullname
                  )}`}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/sms-tracking.svg`}
                    alt="Send SMS"
                  />
                </Link>
              ) : (
                ""
              )}
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
     <Modal
      isOpen={isEditorVisible}
      onRequestClose={closeEditor}
      contentLabel="Suggestion Editor"
      className="modal-content" // CSS class for content
      overlayClassName="modal-overlay" // CSS class for overlay
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Appointment Note</h2>

      {/* Scrollable Modal Body */}
      <div style={{ maxHeight: '70vh', overflowY: 'scroll', padding: '10px' }}>
        <ReactQuill
          value={suggestionText}
          onChange={handleEditorChange}
          placeholder="Type your suggestion here..."
          modules={{
            toolbar: [
              // Styling options
              [{ font: [] }, { size: [] }],

              // Headings
              [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { header: false }],

              // Text styling
              ['bold', 'italic', 'underline', 'strike'], // Basic formatting
              [{ color: [] }, { background: [] }], // Text color and background color

              // Alignment
              [{ align: [] }],

              // Lists and Indentations
              [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],

              // Links and Images
              ['link', 'image', 'video'],

              // Code and clean
              ['code-block', 'blockquote'],
              ['clean'], // Remove formatting
            ],
          }}
          formats={[
            'header',
            'font',
            'size',
            'bold',
            'italic',
            'underline',
            'strike',
            'color',
            'background',
            'align',
            'list',
            'bullet',
            'indent',
            'link',
            'image',
            'video',
            'code-block',
            'blockquote',
          ]}
        />
      </div>

  {/* Buttons Section */}
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <button
      onClick={saveSuggestion}
      disabled={isSaving}
      style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: isSaving ? 'not-allowed' : 'pointer',
        marginRight: '10px',
      }}
    >
      {isSaving ? "Saving..." : "Save"}
    </button>
    <button
      onClick={closeEditor}
      style={{
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Close
    </button>
  </div>
</Modal>


    </div>
  );
};

export default Dashboard;
