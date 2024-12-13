import React, { useState, useEffect } from 'react';
import useAuth from '../Auth/Auth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/login.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  const ATTEMPT_LIMIT = 5;
  const ATTEMPT_STORAGE_KEY = 'huraira_login_attempts';
  const BLOCK_STORAGE_KEY = 'huraira_blocked_until';

  useEffect(() => {
    const checkBlockStatus = () => {
      const blockUntil = localStorage.getItem(BLOCK_STORAGE_KEY);
      if (blockUntil) {
        const expiryTime = new Date(blockUntil).getTime();
        const currentTime = Date.now();
        if (currentTime < expiryTime) {
          setIsBlocked(true);
          setTimer(expiryTime - currentTime);
        } else {
          localStorage.removeItem(BLOCK_STORAGE_KEY);
          localStorage.removeItem(ATTEMPT_STORAGE_KEY);
        }
      }
    };

    checkBlockStatus();

    const interval = setInterval(() => {
      if (isBlocked) {
        setTimer((prev) => {
          if (prev <= 1000) {
            clearInterval(interval);
            setIsBlocked(false);
            localStorage.removeItem(BLOCK_STORAGE_KEY);
            localStorage.removeItem(ATTEMPT_STORAGE_KEY);
            return 0;
          }
          return prev - 1000;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (isBlocked) {
      setError('You are temporarily blocked. Please try again later.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);

      // Clear failed attempts on successful login
      localStorage.removeItem(ATTEMPT_STORAGE_KEY);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');

      // Increment failed attempts
      const attempts = JSON.parse(localStorage.getItem(ATTEMPT_STORAGE_KEY)) || 0;
      const newAttempts = attempts + 1;
      localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(newAttempts));

      if (newAttempts >= ATTEMPT_LIMIT) {
        const blockUntil = new Date(Date.now() + BLOCK_DURATION).toISOString();
        localStorage.setItem(BLOCK_STORAGE_KEY, blockUntil);
        setIsBlocked(true);
        setTimer(BLOCK_DURATION);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Format timer to mm:ss
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-form card p-4">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Huraira Consultancy" />

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              disabled={isBlocked}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isBlocked}
            />
          </div>
          <br />
          {!isLoading ? (
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isBlocked}
            >
              {isBlocked ? `Blocked (${formatTime(timer)})` : 'Login'}
            </button>
          ) : (
            <button type="button" className="btn btn-primary w-100" disabled>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </button>
          )}
        </form>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
