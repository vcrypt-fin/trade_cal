import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { EyeFilledIcon } from "./icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icons/EyeSlashFilledIcon";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

    const handleChange = (field: string) => (value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            // Replace with your registration API call
            await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            navigate('/login');
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Registration failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col gap-1 items-center">
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    {error && (
                        <div className="w-full px-4 py-2 mb-4 text-sm text-red-500 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}
                </CardHeader>
                <Divider/>
                <CardBody className="gap-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Username"
                            placeholder="Enter your username"
                            value={form.username}
                            onValueChange={handleChange('username')}
                            isRequired
                        />
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            value={form.email}
                            onValueChange={handleChange('email')}
                            isRequired
                        />
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={form.password}
                            onValueChange={handleChange('password')}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            isRequired
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onValueChange={handleChange('confirmPassword')}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
                                    {isConfirmVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isConfirmVisible ? "text" : "password"}
                            isRequired
                        />
                        <Button
                            type="submit"
                            color="primary"
                            isLoading={loading}
                            className="w-full"
                        >
                            Register
                        </Button>
                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default RegisterPage;
