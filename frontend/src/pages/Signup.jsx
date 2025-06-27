import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton.jsx';
import { Form } from 'react-bootstrap';

const Signup = () => {
    const navigate = useNavigate();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userData = JSON.parse(localStorage.getItem("userData")) || [];

    const [form, setForm] = useState({
        userid: '',
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const [error, setError] = useState({});

    if (!form.userid) {
        setForm(prev => ({ ...prev, userid: crypto.randomUUID().replace(/-/g, '').slice(0, 3) }));
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleClick = (e) => {
        e.preventDefault();
        const validateErrors = validate();
        setError(validateErrors);
        if (Object.keys(validateErrors).length === 0) {
            const newUsers = [...users, { ...form }];
            localStorage.setItem('users', JSON.stringify(newUsers));
            localStorage.setItem('currentUser', JSON.stringify(form.userid))
            navigate('/onboarding');
        }
    };

    const validate = () => {
        let newError = {};
        if (!form.username.trim()) newError.username = 'Username is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newError.email = 'Valid Email is required';
        if (!form.password.trim()) newError.password = 'Password is required';
        else if (form.password.length < 6) newError.password = 'Must contain at least 6 characters';
        else if (form.password !== form.confirm_password) newError.confirm_password = 'Passwords do not match';
        if (!form.confirm_password.trim()) newError.confirm_password = 'Password is required';
        if (userData.some(u => u.email === form.email)) newError.email = 'User already exists';
        return newError;
    };

    return (
        <div>
            <Form className='mx-3'>
                <h2>Create an account</h2>
                <Form.Group className="m-5">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="username" placeholder="Enter your name" value={form.username} onChange={handleChange} />
                    {error.username && <p style={{color:'red'}}>{error.username}</p>}
                </Form.Group>
                <Form.Group className="m-5">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} />
                    {error.email && <p style={{color:'red'}}>{error.email}</p>}
                </Form.Group>
                <Form.Group className="m-5">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
                    {error.password && <p style={{color:'red'}}>{error.password}</p>}
                </Form.Group>
                <Form.Group className="m-5">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" name="confirm_password" placeholder="Enter your password again" value={form.confirm_password} onChange={handleChange} />
                    {error.confirm_password && <p style={{color:'red'}}>{error.confirm_password}</p>}
                </Form.Group>
                <div style={{ textAlign: 'center' }}>
                    <CustomButton onclick={handleClick} label="Create an account" color="success" />
                    <p>Already have an account? <CustomButton onclick={() => navigate('/login')} label="Login" color="secondary" />
                    </p>
                </div>
            </Form>
        </div>
    );
};

export default Signup;