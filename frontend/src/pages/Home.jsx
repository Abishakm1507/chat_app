import CustomNavBar from '../components/CustomNavBar';
import UserListCard from '../components/UserListCard';
import { Row, Col } from 'react-bootstrap';
import Chat from './Chat';
import { useState, useEffect } from 'react';
import axios from "axios";

const Home = () => {

    const [filter, setFilter] = useState("");
    const [userData, setUserData] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [click, setClick] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/user")
            .then(res => setUserData(res.data))
            .catch(err => {
                console.log(err);
                setUserData([]);
            });
    }, []);

    return (
        <Row style={{ margin: '0 25px', padding: '1px', position: 'static' }}>
            <Col style={{ width: '600px', marginRight: '30px' }}>
                <Row>
                    <CustomNavBar filter={filter} setFilter={setFilter} />
                </Row>
                <Row>
                    <Col className="userList" onClick={() => setClick(true)}>
                        <UserListCard filter={filter} currentUser={currentUser} userData={userData} />
                    </Col>
                </Row>
            </Col>
            <Col className='sideContainer'>
                {click ? <Chat userData={userData} /> :
                    <div className='noChatContainer' style={{ textAlign: 'center', marginTop: (window.innerWidth >= 1000) ? '45%' : '200%', width: '100%', marginLeft: '50%' }}>
                        <img src="https://img.freepik.com/free-vector/select-concept-illustration_114360-383.jpg" style={{ width: (window.innerWidth >= 1000) ? '40%' : '100%' }} height="auto" alt="slect_a_chat" />
                        <p style={{ fontSize: (window.innerWidth >= 1000) ? '15px' : '10px' }}>Select a chat to view message</p>
                    </div>}
            </Col>
            <Col>
            </Col>
        </Row>
    );
};

export default Home;