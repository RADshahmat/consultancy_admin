import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import DashboardApis from './Services/admindashboardApis';
import LoginPage from './Services/login';
import { useEffect } from 'react';
import useAuth from './Auth/Auth';
import axiosInstance from './Auth/AxiosInstance';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();
  console.log(user, loading);
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/" />;
};

const RedirectIfAuthenticated = ({ element }) => {
  const { user, loading } = useAuth();
  console.log(user, loading);
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/dashboard" /> : element;
};

function App() {
  console.log('dhokse');

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<RedirectIfAuthenticated element={<LoginPage />} />} />
          <Route path="/dashboard/*" element={<ProtectedRoute element={<DashboardApis />} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
