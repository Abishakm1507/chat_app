import CustomButton from '../components/CustomButton.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState({});

    useEffect(() => {
        axios.get("http://localhost:8080/user")
            .then(res => setUserData(res.data))
            .catch(err => {
                console.log(err);
                setUserData([]);
            });
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const user = userData.find(user => user.email === form.email);

    const handleClick = (e) => {
        e.preventDefault();
        const validateErrors = validate();
        setError(validateErrors);
        if (Object.keys(validateErrors).length === 0 && user) {
            localStorage.setItem("currentUser", JSON.stringify(user.userid));
            navigate('/home');
        }
    };

    const validate = () => {
        let newError = {};
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
            newError.email = 'Valid Email is required';
        }
        if (!form.password.trim()) {
            newError.password = 'Password is required';
        } else if (form.password.length < 6) {
            newError.password = "Password must contain at least 6 characters";
        }
        if (!user) {
            newError.email = "User does not exist";
        } else if (form.password !== user.passwords) {
            newError.password = "Incorrect password";
        }
        return newError;
    };

    return (
        <div>
            <Form className='mx-3'>
                <h2>Login</h2>
                <Form.Group className="m-5">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} placeholder="Enter your email" onChange={handleChange} />
                    {error.email && <p style={{ color: 'red' }}>{error.email}</p>}
                </Form.Group>
                <Form.Group className="m-5">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={form.password} placeholder="Enter your password" onChange={handleChange} />
                    {error.password && <p style={{ color: 'red' }}>{error.password}</p>}
                </Form.Group>
                <div style={{ textAlign: 'center' }}>
                    <CustomButton onclick={handleClick} label="Login" color="success" />
                    <p>Don't have an account? <CustomButton onclick={() => navigate('/signup')} label="Signup" color="secondary" /></p>
                </div>
            </Form>
        </div>
    );
};

export default Login;