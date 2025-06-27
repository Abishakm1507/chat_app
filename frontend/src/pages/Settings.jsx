import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import { FaRegEdit } from "react-icons/fa";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        axios.get("http://localhost:8080/user")
            .then(res => setUserData(res.data))
            .catch(err => {
                console.log(err);
                setUserData([]);
            });
    }, []);

    const userProfile = userData.find(user => user.userid === currentUser) || {};

    return (
        <div>
            <h2 className='m-5'>
                <IoChevronBackOutline
                    style={{ fontSize: '30px', textAlign: 'center', marginBottom: '10px', cursor: 'pointer' }}
                    onClick={() => navigate('/home')}
                />
                Settings
            </h2>
            <Card className='m-5'>
                {userProfile.image && (
                    <Image className="mx-auto my-3" src={userProfile.image} alt="Profile Preview" style={{ width: 150, height: 150, objectFit: 'cover', marginTop: 10 }} roundedCircle />
                )}
                <Card.Body>
                    <Card.Title className="text-center">Username: {userProfile.username || "N/A"}</Card.Title>
                    <hr />
                    <Card.Title className="text-center">Bio: {userProfile.bio || "N/A"}</Card.Title>
                    <hr />
                    <Row onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                        <Col>
                            <Card.Title>Profile</Card.Title>
                        </Col>
                        <Col xs="auto">
                            <Button>Edit Profile <FaRegEdit style={{ marginBottom: '5px' }} /></Button>
                        </Col>
                    </Row>
                    <hr />
                    <Button
                        variant='danger'
                        onClick={() => {
                            localStorage.removeItem("currentUser");
                            navigate('/getstarted');
                        }}
                    >
                        Logout <MdOutlineLogout style={{ marginBottom: '5px' }} />
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Settings;