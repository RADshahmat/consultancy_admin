import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import './App.css';
import DashboardApis from './Services/admindashboardApis';
import LoginPage from './Services/login';
import useAuth from './Auth/Auth';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? React.cloneElement(element, { user }) : <Navigate to="/" />;
};

const RedirectIfAuthenticated = ({ element }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/dashboard" /> : element;
};

const DashboardRedirect = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard') && location.pathname !== '/dashboard') {
      window.location.href = '/dashboard';
    }
  }, []);

  return children;
};

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<RedirectIfAuthenticated element={<LoginPage />} />} />
          <Route
            path="/dashboard/*"
            element={
              <DashboardRedirect>
                <ProtectedRoute element={<DashboardApis />} />
              </DashboardRedirect>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
