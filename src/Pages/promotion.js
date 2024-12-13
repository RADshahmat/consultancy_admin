import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/promotionform.css";
import axiosInstance from "../Auth/AxiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import { DNA } from "react-loader-spinner";
import Notes from "./notes";
import { VscSend } from "react-icons/vsc";

const PromotionForm = () => {
  const [sms, setSms] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [sendBy, setSendBy] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const phoneParam = params.get("phone");
  const phone = phoneParam ? `+${phoneParam.replace(" ", "")}` : "";
  const fullname = params.get("fullname");

  const inputRef = useRef(null);
  const appointmentsListRef = useRef(null);

  useEffect(() => {
    if (phone) {
      setSms([decodeURIComponent(phone)]);
    }
  }, [phone]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const result = await axiosInstance.get("getAllAppoinment");
        //console.log("Result: ", result);
        setAppointments(result.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        appointmentsListRef.current &&
        !appointmentsListRef.current.contains(event.target)
      ) {
        setShowAppointments(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, appointmentsListRef]);

  const fetchFilteredAppointments = useCallback(async () => {
    const currentFromDate = fromDate || "";
    const currentToDate = toDate || "";
    if (currentFromDate == "" || currentToDate == "") {
      return;
    }

    try {
      const result = await axiosInstance.post("getAllNumbers", {
        fromDate: currentFromDate,
        toDate: currentToDate,
      });
      //("Result: ", result);
      const newAppointments = result.data;

      const uniqueNumbers = Array.from(
        new Set(newAppointments.map((appointment) => appointment.user_phonenum))
      );

      const filteredUniqueNumbers = uniqueNumbers.filter(
        (num) => !sms.includes(num)
      );

      setNumbers(filteredUniqueNumbers);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [fromDate, toDate, sms]);

  useEffect(() => {
    fetchFilteredAppointments();
  }, [fetchFilteredAppointments]);

  const handleSend = async () => {
    setLoading(true);
    const allNumbers = [...sms, ...numbers];
    try {
      const result = await axiosInstance.post("sendBulkSms", {
        sms: allNumbers,
        message,
      });
      //console.log(result.data.result);
      const successCount = result.data.result.filter(
        (response) => response.status === "SUCCESS"
      ).length;
      const failureCount = result.data.result.filter(
        (response) => response.status !== "SUCCESS"
      ).length;
      setTimeout(() => {
        setSendResult({ success: successCount, failure: failureCount });
      }, 500);
      
    } catch (error) {
      console.error("Error sending SMS:", error);
      setSendResult({ success: 0, failure: allNumbers.length });
    } finally {
        setTimeout(() => {
          setLoading(false);  
          }, 1000);
        
      
    }
  };

  const handleSendByChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSendBy(value);
      console.log(value,appointments);
      if (value) {
        const filtered = appointments.filter((appointment) => {
          const fullname = appointment.user_fullname || ""; // Fallback to an empty string
          const phonenum = appointment.user_phonenum || ""; // Fallback to an empty string
      
          return (
            fullname.toLowerCase().includes(value.toLowerCase()) ||
            phonenum.includes(value)
          );
        });
      
        setFilteredAppointments(filtered);
        setShowAppointments(true);
      } else {
        setShowAppointments(false);
      }
      
    },
    [appointments]
  );

  const handleAppointmentClick = useCallback((phoneNumber) => {
    setSms((prevSms) => {
      const phones = prevSms ? [...prevSms] : [];
      if (!phones.includes(phoneNumber)) {
        phones.unshift(phoneNumber);
      }
      return phones;
    });

    setShowAppointments(false);
  }, []);

  const handleToDateChange = useCallback((e) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
  }, []);

  const handleFromDateChange = useCallback((e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
  }, []);

  const calculateMessages = (text) => {
    const charCount = text.length;
    const messageCount = Math.ceil(charCount / 160);
    return `${charCount}/${messageCount}`;
  };

  const formatNumbersForDisplay = () => {
    const combinedNumbers = [...sms, ...numbers];
    return combinedNumbers.join(", ");
  };

  return (
    <div className="promotion-form">
      {(loading || sendResult) && (
        <div className="notificationContainer">
          {loading && (
            <div className="loading-screen">
              <DNA
                visible={true}
                height="150"
                width="150"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                
                wrapperClass="dna-wrapper"
              />
            </div>
          )}
          {!loading && sendResult && (
            <div className="send-result">
              <p style={{ color: "black" }}>
                Messages Sent: {sendResult.success}
              </p>
              <p style={{ color: "black" }}>
                Messages Failed: {sendResult.failure}
              </p>
              <button
                className="btn btn-success"
                onClick={() => setSendResult(null)}
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}

      <div className="form-gr">
        <label>Send SMS :</label> &nbsp; &nbsp; &nbsp;
        <input
          type="text"
          value={formatNumbersForDisplay()}
          onChange={(e) =>
            setSms(e.target.value.split(",").map((phone) => phone.trim()))
          }
        />
        <span>Total Numbers: {sms.length + numbers.length}</span>
      </div>
      <div className="form-gr">
        <label>Send by Name:</label>
        <input
          type="text"
          value={sendBy}
          onChange={handleSendByChange}
          onFocus={() => sendBy && setShowAppointments(true)}
          ref={inputRef}
        />
        {showAppointments && (
          <div className="appointments-list" ref={appointmentsListRef}>
            {filteredAppointments.map((appointment, index) => (
              <div
                key={index}
                className="appointment-item"
                onClick={() =>
                  handleAppointmentClick(appointment.user_phonenum)
                }
              >
                <p>
                  {appointment.user_fullname} : {appointment.user_phonenum}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="form-group">
        <label>Bulk User By Date:</label>
        <div className="date-range">
          <div>
            <label>From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
            />
          </div>
          <div>
            <label>To:</label>
            <input type="date" value={toDate} onChange={handleToDateChange} />
          </div>
        </div>
      </div>
      <div className="form-group message-group">
        
        <div className="message-counter">
          <textarea
            value={message}
            placeholder="Type Message Here..."
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <span>{calculateMessages(message)}</span>
        </div>
        <button onClick={handleSend} className="send-button">
          Send <VscSend color="white"/>
        </button>
      </div>
      <Notes/>
    </div>
  );
};

export default PromotionForm;
