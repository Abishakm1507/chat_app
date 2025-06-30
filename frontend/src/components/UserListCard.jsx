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
    const [hasKey, setHasKey] = useState(false)
    const [updatedUser, setUpdatedUser] = useState([]);
    useEffect(() => {
        const timer = setTimeout(() => {
            axios
                .get(`http://localhost:8080/user/${currentUser}/${filter}`)
                .then((res) => {
                    setUpdatedUser(res.data);
                    setHasKey(res.data.some((obj) => Object.keys(obj).includes('text')));
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                    setUpdatedUser([]);
                });
        }, 500);

        return () => clearTimeout(timer);
    }, [filter, currentUser, updatedUser]);


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

    useEffect(() => {
        axios.get('http://localhost:8080/notify')
            .then(res => {
                setNotify(res.data || []);
            })
            .catch(err => console.log(err));
    }, [notify]);

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
                    console.log("notification removed")
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
                    <Card key={user.msgid}
                        onClick={() => {
                            setState(user.userid);
                            removeNotification(user.userid);
                        }}
                        style={{ margin: '10px', padding: '5px', cursor: 'pointer' }}>
                        <Row className="align-items-center" style={{ width: '400px' }}>
                            <Col xs="auto">
                                {hasNotification(user.userid) &&
                                    <Badge color="success" overlap="circular" badgeContent=" " variant="dot" style={{ margin: '5px' }}></Badge>}
                                <Image src={user.image} alt={`Profile of ${displayName}`} roundedCircle style={{ width: hasKey ? '20px' : '50px', height: hasKey ? '20px' : '50px', objectFit: 'cover', marginLeft: '10px' }} />
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>{displayName}</Card.Title>
                                    <Card.Text style={{ overflow: 'hidden', display: hasKey ? 'none' : 'contents' }}>{user.bio}</Card.Text>
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
                                                        {user.text && (() => {
                                                            const match = user.text.match(filter);
                                                            if (!match) {
                                                                return (
                                                                    <Button style={{ cursor: 'default' }} disabled>
                                                                        <Card.Text>{user.text}</Card.Text>
                                                                    </Button>
                                                                );
                                                            }
                                                            const start = user.text.indexOf(match[0]);
                                                            const end = start + match[0].length;
                                                            return (
                                                                <Button style={{ cursor: 'default'}} disabled>
                                                                    <Card.Text>
                                                                        {user.text.slice(0, start)}
                                                                        <span style={{ backgroundColor:'yellow', color: 'black', fontWeight: 'bold' }}>{match[0]}</span>
                                                                        {user.text.slice(end)}
                                                                    </Card.Text>
                                                                </Button>
                                                            );
                                                        })()}

                                                        <Row>{user.timestamp &&
                                                            <Card.Subtitle style={{ marginTop: '2px' }}>{user.timestamp.slice(10,)}</Card.Subtitle>}</Row>
                                                    </Col>
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