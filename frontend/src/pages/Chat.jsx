
import ChatNav from '../components/ChatNav';
import ChatContainer from '../components/ChatContainer.jsx';
import axios from "axios";
import { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';

const Chat = () => {
    const [ userData, setUserData] = useState([]);
    const [selectedUser, setSelecteduser] = useState(JSON.parse(localStorage.getItem("selectedUser")));
    const [filter, setFilter] = useState('');
   
    useEffect(() => {
        setInterval(() =>{
            setSelecteduser(JSON.parse(localStorage.getItem("selectedUser")))
        },100)
    },[selectedUser])

    useEffect(() =>{
        axios.get("http://localhost:8080/user").then(res => setUserData(res.data)).catch((err) => { console.log(err); setUserData([])});
    },[])

    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    const userProfile = userData.find(user => user.userid === selectedUser) || {};

    const SenderProfile = userData.find(user => user.userid === currentUser) || {};

    const displayName = selectedUser === currentUser ? "You" : userProfile.username;

    return (
        <Container>
            <Row>
            <ChatNav userId={selectedUser} Username={displayName} userImage={userProfile.image} filter={filter} setFilter={setFilter} />
            </Row>
            <Row>
            <ChatContainer ReceiverId={selectedUser} senderId={currentUser} senderName={SenderProfile.username} filter={filter} />
            </Row>
        </Container>
    )
}

export default Chat;