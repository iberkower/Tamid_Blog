import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { token, user } = await login(formData.email, formData.password);
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user._id);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="bi bi-envelope"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="bi bi-lock"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2">
                                    Login
                                </button>
                            </form>
                            <div className="text-center mt-4">
                                <p className="mb-0">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="text-primary">Sign up here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 