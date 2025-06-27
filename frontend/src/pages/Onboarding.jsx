import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton.jsx';
import { Form, Image } from 'react-bootstrap';
import axios from 'axios';

const Onboarding = () => {
    const navigate = useNavigate();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userProfile = users.find(user => user.userid === currentUser) || {};

    const [userData, setUserData] = useState({
        userid: currentUser,
        username: userProfile.username || '',
        email: userProfile.email || '',
        passwords: userProfile.password || '',
        bio: '',
        image: ''
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setUserData(prev => ({ ...prev, image: reader.result }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/user', userData);
            navigate('/home');
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div>
            <Form className='m-5'>
                <h2>Update your profile</h2>
                {userData.image && (
                    <div className='text-center'>
                        <Image className="img-fluid" src={userData.image} alt="Profile Preview" style={{ width: 150, height: 150, objectFit: 'cover', marginTop: 10 }} roundedCircle /> <br />
                    </div>
                )}
                <Form.Label>Bio</Form.Label>
                <Form.Control type="text" name="bio" placeholder="Enter bio about yourself" value={userData.bio} onChange={handleChange} />
                <Form.Label>Profile Pic</Form.Label>
                <Form.Control
                    type="text"
                    name="image"
                    value={userData.image} onChange={handleChange}
                />
                <CustomButton onclick={handleClick} label="Finish" color="primary" />
            </Form>
        </div>
    );
};

export default Onboarding;