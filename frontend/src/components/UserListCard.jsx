import { Card, Image, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Badge from '@mui/material/Badge';

const UserListCard = ({ filter, currentUser }) => {
    const [state, setState] = useState('');
    const [chatKey, setChatKey] = useState('');
    const [notify, setNotify] = useState([]);
    const senderId = JSON.parse(localStorage.getItem("currentUser"));
    const selectedUser = JSON.parse(localStorage.getItem("selectedUser1"));
    // const [filteredItems, setFilteredItems] = useState([]);
    const [updatedUser, setUpdatedUser] = useState([]);
    useEffect(() => {
  const timeout = setTimeout(() => {
    axios.get(`http://localhost:8080/user/${currentUser}/${filter}`)
      .then(res => setUpdatedUser(res.data))
      .catch(err => {
        console.log(err);
        setUpdatedUser([]);
      });
  }, 1000);

  return () => clearTimeout(timeout);
}, [filter, currentUser]);

    const hasKey = updatedUser.some(obj => Object.keys(obj).includes('text'));

    const getChatKey = (id1, id2) => {
        const [a, b] = [id1, id2].sort();
        return `${a}${b}`;
    };

    useEffect(() => {
        localStorage.setItem("selectedUser", JSON.stringify(state));
        setChatKey(getChatKey(senderId, state));
    }, [state, senderId]);

    useEffect(() => {
        localStorage.setItem("selectedChat", JSON.stringify(chatKey));
    }, [chatKey]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         axios.get('http://localhost:8080/notify')
    //             .then(res => {
    //                 setNotify(res.data || []);
    //             })
    //             .catch(err => console.log(err));
    //     }, 10000)
    // }, [notify]);

    const hasNotification = (userId) => {
        return notify.some(
            n => n.sender === userId && n.receiver === currentUser && n.seen === false
        );
    };

    const removeNotification = (userId) => {
        const notification = notify.find(
            n => n.sender === userId && n.receiver === currentUser
        );
        if (notification) {
            axios.put('http://localhost:8080/notify', notification)
                .then((res) => {
                    setNotify(res.data)
                })
                .catch(err => console.log(err));
        }
    };

    useEffect(() => {
        if (chatKey.includes(selectedUser)) {
            removeNotification(selectedUser);
        }
    }, [notify, chatKey, selectedUser])

    return (
        <div style={{ width: '400px' }}>
            {updatedUser.map((user) => {
                const displayName = user.userid === currentUser ? "You" : user.username;
                return (
                    <Card key={user.userid}
                        onClick={() => {
                            setState(user.userid);
                            removeNotification(user.userid);
                        }}
                        style={{ margin: '10px', padding: '5px', cursor: 'pointer' }}>
                        <Row className="align-items-center" style={{ width: '400px' }}>
                            <Col xs="auto">
                                {hasNotification(user.userid) &&
                                    <Badge color="success" overlap="circular" badgeContent=" " variant="dot" style={{ margin: '5px' }}></Badge>}
                                <Image src={user.image} alt={`Profile of ${displayName}`} roundedCircle style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '10px' }} />
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>{displayName}</Card.Title>
                                    <Card.Text style={{ overflow: 'hidden' }}>{user.bio}</Card.Text>
                                </Card.Body>
                            </Col>
                        </Row>
                        {hasKey &&
                            <div>
                                <Card>
                                    <Row>
                                        <Col>
                                            <Card.Body>
                                                <Row>
                                                     <Col xs="auto">
                                <Image src={user.sender_image} alt={`Profile of ${displayName}`} roundedCircle style={{ width: '20px', height: '20px', objectFit: 'cover', marginBottom: '10px' }} />
                            </Col>
                                                    <Col>
                                                <Card.Title>{user.sendername}</Card.Title>
                                                <Card.Text><Button>{user.text}</Button></Card.Text>
                                                </Col>
                                                {/* <Col>
                                                <Card.Subtitle style={{ marginTop: '2px' }}>{user.timestamp.slice(0,5)}</Card.Subtitle>
                                                </Col> */}
                                                </Row>
                                                
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </div>}
                    </Card>
                );
            })}
        </div>
    );
};

export default UserListCard;