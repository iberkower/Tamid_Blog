import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await signup(formData.name, formData.email, formData.password);
            console.log('Signup response in component:', response);

            if (response && response.token && response.user) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userId', response.user._id);
                localStorage.setItem('userName', response.user.name);
                navigate('/');
            } else {
                console.error('Invalid signup response:', response);
                setError('Signup response was invalid. Please try again.');
            }
        } catch (error) {
            console.error('Signup error in component:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else if (error.response?.data?.errors) {
                setError(error.response.data.errors[0].msg);
            } else {
                setError('Signup failed. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Sign Up</h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>
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
                                            minLength="6"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirm Password
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="bi bi-lock-fill"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            minLength="6"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2">
                                    Sign Up
                                </button>
                            </form>
                            <div className="text-center mt-4">
                                <p className="mb-0">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary">Login here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup; 