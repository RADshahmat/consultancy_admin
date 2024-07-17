import React, { useState } from 'react';
import useAuth from '../Auth/Auth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/login.css'

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      await login(username, password);
      navigate('/dashboard'); 
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-form card p-4">

        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt='Huraira Consultancy'></img>

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
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
            />
          </div> <br /> 
          {!isLoading ? (
            <button type="submit" className="btn btn-primary w-100">Login</button>
          ) : (
            <button type="button" className="btn btn-primary w-100" disabled>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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

