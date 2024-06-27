import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarCheck, FaBullhorn, FaMoneyBillWave, FaUserShield, FaBox, FaTachometerAlt } from 'react-icons/fa';
import "../Styles/sidebar.css";
import axiosInstance from '../Auth/AxiosInstance';

const Sidebar = ({ user }) => {
    const { pathname } = useLocation();
    const location = useLocation();
    

   

    console.log('sidebar user:', user);

    return (
        <div className="sidebar">
            <div className="menu">
                {user && user.dashboard &&
                    <Link to="/dashboard" className="menu-item">
                        <FaTachometerAlt className="menu-icon" />
                        <span>Dashboard</span>
                    </Link>
                }
                {user && user.appointment &&
                    <Link to="/dashboard/appointment" className="menu-item">
                        <FaCalendarCheck className="menu-icon" />
                        <span>Appointment</span>
                    </Link>
                }
                {user && user.promotion &&
                    <Link to="/dashboard/promotion" className="menu-item">
                        <FaBullhorn className="menu-icon" />
                        <span>Promotion</span>
                    </Link>
                }
                {user && user.payment &&
                    <Link to="/dashboard/payment" className="menu-item">
                        <FaMoneyBillWave className="menu-icon" />
                        <span>Payment</span>
                    </Link>
                }
                {user && user.permission &&
                    <Link to="/dashboard/permission" className="menu-item">
                        <FaUserShield className="menu-icon" />
                        <span>Permissions</span>
                    </Link>
                }
                {user && user.package &&
                    <Link to="/dashboard/package" className="menu-item">
                        <FaBox className="menu-icon" />
                        <span>Packages</span>
                    </Link>
                }
            </div>
            <Link to="/dashboard/cngpassword" className={`sidebar_footer ${pathname === '/dashboard/cngpassword' ? 'active' : ''}`}>
                <button className="sidebar-change-password-button">Change Password</button>
            </Link>
        </div>
    );
};

export default Sidebar;
