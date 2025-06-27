import { Form, Image } from 'react-bootstrap';
import Media from '../components/Media';
import axios from 'axios';
import { useState, useEffect } from 'react';

function ProfileUser() {
    const [userData, setUserData] = useState([]);
    const selectedUser = JSON.parse(localStorage.getItem("selectedUser"));

    useEffect(() => {
        axios.get("http://localhost:8080/user")
            .then(res => setUserData(res.data))
            .catch(err => {
                console.log(err);
                setUserData([]);
            });
    }, []);

    const user = userData.find((user) => user.userid === selectedUser) || {
        username: '',
        bio: '',
        email: '',
        image: ''
    };

    return (
        <div>
            <Form className='mx-5 my-3'>
                <h2>Profile</h2>
                {user.image && (
                    <div className='text-center'>
                        <Image
                            className="img-fluid"
                            src={user.image}
                            alt="Profile Preview"
                            style={{ width: 150, height: 150, objectFit: 'cover', marginTop: 10 }}
                            roundedCircle
                        /> <br />
                    </div>
                )}

                <Form.Label>Username</Form.Label>
                <span>
                    <Form.Control type="text" name="username" value={user.username} disabled />
                </span>
                <hr />

                <Form.Label>Bio</Form.Label>
                <span>
                    <Form.Control type="text" name="bio" value={user.bio} disabled />
                </span>
                <hr />

                <Form.Label>Email</Form.Label>
                <span>
                    <Form.Control type="email" name="email" value={user.email} disabled />
                </span>
                <hr />
            </Form>
            <Media />
        </div>
    );
}

export default ProfileUser;