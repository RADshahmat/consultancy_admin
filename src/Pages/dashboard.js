import React from 'react';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import '../Styles/admindashboard.css';

const Dashboard = () => {
    return (
        <div>
            <table className="schedule">
                <thead>
                    <tr>
                        <th>Time Slot</th>
                        <th>Saturday<br />17 April</th>
                        <th>Sunday<br />18 April</th>
                        <th>Monday<br />19 April</th>
                        <th>Tuesday<br />20 April</th>
                        <th>Wednesday<br />21 April</th>
                        <th>Thursday<br />22 April</th>
                        <th>Friday<br />23 April</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>9:00 AM - 10:00 AM</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>10:15 AM - 11:15 AM</td>
                        <td className="reserved">Tanvir Ah.</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>11:30 AM - 12:30 PM</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>12:45 PM - 1:45 PM</td>
                        <td className="reserved">Ponni</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>2:00 PM - 3:00 PM</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>3:15 PM - 4:15 PM</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>4:30 PM - 5:30 PM</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>7:00 PM - 8:00 PM</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>8:15 PM - 9:15 PM</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div className="navigation-buttons">
                <button className="nav2-button"><FaArrowAltCircleLeft className='nav2-btn-icon'/> Previous Week</button>
                <button className="nav2-button">Next Week<FaArrowAltCircleRight className='nav2-btn-icon'/></button>
            </div>
            <h3>You Have 2 Reservations Today</h3>
            <div className="reservation-details">
                <div className="reservation-card">
                    <p>Name: Tanvir Ahmed Tamim</p>
                    <p>Phone: 01729615173</p>
                    <p>Individual Counselling</p>
                    <p>In Person Meeting</p>
                    <p>User ID: 007</p>
                    <p>Booking Time: Morning, 10 AM TO 11 AM</p>
                    <button>Cancel This Reservation</button>
                </div>
                <div className="reserv-result">
                    <p>Name: Tanvir Ahmed Tamim</p>
                    <p>Phone: 01729615173</p>
                    <p>Individual Counselling</p>
                    <p>In Person Meeting</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
