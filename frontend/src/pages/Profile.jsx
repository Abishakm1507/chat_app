import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton.jsx';
import { Form, Image } from 'react-bootstrap';
import { IoChevronBackOutline } from "react-icons/io5";
import axios from "axios";

const Profile = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(true);
    const [userData, setUserData] = useState([]);
    const [form, setForm] = useState({
        userid: currentUser,
        username: '',
        email: '',
        passwords: '',
        bio: '',
        image:''
    });

    useEffect(() => {
        axios.get('http://localhost:8080/user')
            .then(res => {
                setUserData(res.data);
                const userProfileData = res.data.find(user => user.userid === currentUser) || {};
                setForm({
                    userid: currentUser,
                    username: userProfileData.username || '',
                    email: userProfileData.email || '',
                    passwords: userProfileData.passwords || '',
                    bio: userProfileData.bio || '',
                    image: userProfileData.image || ''
                });
            })
            .catch(err => console.log(err));
    }, [currentUser]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClick = (e) => {
        e.preventDefault();
        setDisabled(false);
    };

    const handleSave = () => {
        axios.put(`http://localhost:8080/user/${currentUser}`, form)
            .then(res => {
                setDisabled(true);
                navigate('/settings');
            })
            .catch(err => console.log(err));
    };

    return (
        <Form className='mx-5 my-3'>
            <h2>
                <IoChevronBackOutline
                    style={{ fontSize: '30px', textAlign: 'center', marginBottom: '5px', cursor: 'pointer' }}
                    onClick={() => navigate('/settings')}
                />
                Profile
            </h2>
            {form.image && (
                    <Image className="mx-auto d-block" src={form.image} alt="Profile Preview" style={{ width: 150, height: 150, objectFit: 'cover', marginTop: 10 }} roundedCircle />
                )}<br />
            <Form.Label>Profile Image</Form.Label>
            <span>
                <Form.Control
                    type="text"
                    name="image"
                    value={form.image}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </span>
            <hr />
            <Form.Label>Username</Form.Label>
            <span>
                <Form.Control
                    type="text"
                    name="username"
                    value={form.username}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </span>
            <hr />

            <Form.Label>Bio</Form.Label>
            <span>
                <Form.Control
                    type="text"
                    name="bio"
                    value={form.bio}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </span>
            <hr />

            <Form.Label>Email</Form.Label>
            <span>
                <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </span>
            <hr />

            <Form.Label>Change Password</Form.Label>
            <span>
                <Form.Control
                    type="password"
                    name="passwords"
                    value={form.passwords}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </span>
            <hr />

            <CustomButton onclick={handleClick} label="Edit" color="secondary" />
            <CustomButton onclick={handleSave} label="Save" color="primary" />
        </Form>
    );
};

export default Profile;