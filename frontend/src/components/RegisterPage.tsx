import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            // Replace with your registration API call
            await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
/* Add this CSS to your stylesheet or in a <style> tag in your component */
