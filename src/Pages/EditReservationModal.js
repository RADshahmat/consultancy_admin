import React, { useState, useEffect } from "react";
import axiosInstance from "../Auth/AxiosInstance";
import styles from "../Styles/EditReservationModal.module.css";

const EditReservationModal = ({ isOpen, onClose, appointment, onUpdate }) => {
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots1, setTimeSlots1] = useState([]);
  const [duration, setDuration] = useState(null);

  const fetchTimeSlots = async (date) => {
    try {
      const response = await axiosInstance.get(`/timeslots?date=${date}`);
      //console.log("this is the date", response);
      setTimeSlots(response.data);
      const timeSlotsData = response.data;
      const data = [];

      const slotIds = timeSlotsData.map((slot) => slot.slot_id);

      if (slotIds.includes(1) && slotIds.includes(2)) {
        data.push({ slot_id: 12, time_slot: "9:00 AM - 10:30 AM" });
      }
      if (slotIds.includes(3) && slotIds.includes(4)) {
        data.push({ slot_id: 34, time_slot: "11:30 AM - 1:00 PM" });
      }
      if (slotIds.includes(5) && slotIds.includes(6)) {
        data.push({ slot_id: 56, time_slot: "2:00 PM - 3:30 PM" });
      }
      if (slotIds.includes(8) && slotIds.includes(9)) {
        data.push({ slot_id: 89, time_slot: "7:00 PM - 8:30 PM" });
      }

      setTimeSlots1(data);
      if (appointment.package_name == "Couple Counselling") {
        setDuration("1.5");
      } else {
        setDuration("1.0");
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
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
    onClose();
    setSuccess(false);
  };
  const handelClose1 = async () => {
    onClose();
    setDate("");
    setSelectedTimeSlot("");
    //setSuccess(false);
  };
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/updateappointment?appointment_id=${appointment.appointment_id}`,
        { date, time_Slot: selectedTimeSlot }
      );
      if (response.status === 200) {
        setSuccess(true);
        setDate("");
        setSelectedTimeSlot("");
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
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-content"]}>
          {success ? (
            <div>
              <p className={styles["success-message"]}>Updated successfully</p>
              <button
                className={styles["success-button"]}
                onClick={handelClose}
              >
                Okay
              </button>
            </div>
          ) : (
            <div>
              <h3>Edit Reservation</h3>
              <label>Date:</label>
              <input type="date" value={date} onChange={handleDateChange} />
              <label>Time Slot:</label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                <option value="">Select a time slot</option>

                {duration === "1.0"
                  ? timeSlots.map((slot) => (
                      <option key={slot.slot_id} value={slot.slot_id}>
                        {slot.time_slot}
                      </option>
                    ))
                  : timeSlots1.map((slot) => (
                      <option key={slot.slot_id} value={slot.slot_id}>
                        {slot.time_slot}
                      </option>
                    ))}
              </select>
              <div className={styles["modal-buttons"]}>
                <button onClick={handelClose1}>Cancel</button>
                <button onClick={handleConfirm}>
                  {loading ? "Loading..." : "Confirm"}
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
