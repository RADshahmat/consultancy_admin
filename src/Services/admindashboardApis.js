import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Sidebar from '../Pages/sidebar';
import Header from '../Pages/header_admin';
import Dashboard from '../Pages/dashboard';
import Appointment from '../Pages/appointment';
import PromotionForm from '../Pages/promotion';
import Payment from '../Pages/payment';
import Package from '../Pages/package';
import "../Styles/admindashboard.css"; 


const DashboardApis = () => {
    return (
        <Router>
            <div className="dashboard-container">
                <Header />
                <Sidebar />
                <div className="main-content">
                    <Routes>
                        <Route path="/appointment" element={<Appointment />} />
                        <Route path="/promotion" element={<PromotionForm />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/package" element={<Package />} />
                        <Route path="/" element={<Dashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
        
    );
};

export default DashboardApis;
