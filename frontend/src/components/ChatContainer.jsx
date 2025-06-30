import { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import { Container, Image, Card, Button } from 'react-bootstrap';
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

function ChatContainer({ ReceiverId, senderId, senderName, filter }) {
  const selectedUser = JSON.parse(localStorage.getItem("selectedUser"))
  localStorage.setItem("selectedUser1", JSON.stringify(selectedUser))
  const [windowSize, setWindowSize] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);
  useEffect(() => {
    if (window.innerWidth < 1000) {
      window.scrollTo(0, document.body.scrollHeight);
    }
    setWindowSize(window.innerWidth);
  }, [windowSize]);

  const [messages, setMessages] = useState([]);
  const [notify, setNotify] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/message/${senderId}/${ReceiverId}`)
      .then(res => setMessages(res.data))
      .catch((err) => console.log(err));
  }, [senderId, ReceiverId]);

  const sendMessage = (message) => {
    const newMessage = {
      ...message,
      sender: senderId,
      receiver: ReceiverId,
      sendername: senderName,
      timestamp: new Date().toLocaleString()
    };

    const notifyUser = {
      sender: senderId,
      receiver: ReceiverId
    }

    axios.post(`http://localhost:8080/message`, newMessage)
      .then(() => {
        socket.emit("message", newMessage);
        socket.on("message", (message) => {
          setMessages(prev => [...prev, newMessage])
        });
      })
      .catch(err => console.log(err));

    axios.post('http://localhost:8080/notify', notifyUser)
      .then(res => {
        console.log("Data posted")
        console.log(notifyUser)
        setNotify([])
      })
      .catch(err => console.log(err))
  };

  const handleClear = async (e) => {
    e.preventDefault();
    await axios.delete(`http://localhost:8080/message/${senderId}/${ReceiverId}`)
      .then(() => setMessages([]))
      .catch(console.log);
  };

  useEffect(() => {
    const filtered = messages.filter((item) =>
      (item.text || '').toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [messages, filter])

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollTop = cardRef.current.scrollHeight;
    }
  }, [filteredItems, windowSize]);

  return (
    <Container style={{
      marginBottom: '50px',
      marginTop: window.innerWidth >= 1000 ? '70px' : '90px',
      display: 'flex',
      flexDirection: 'column',
      height: window.innerWidth >= 1000 ? '550px' : (window.innerHeight >= 600 ? '550px' : '150px'),
      overflowY: 'scroll'
    }}>
      <Button className='position-fixed fixed-top'
        variant="danger"
        type="button"
        onClick={handleClear}
        style={{
          marginLeft: window.innerWidth >= 1000 ? '87%' : '80%',
          marginTop: window.innerWidth >= 1000 ? '6%' : '15%',
          marginBottom: '5px',
          width: '100px'
        }}>
        Clear
      </Button>
      <Card ref={cardRef} style={{ border: 'none', width: '800px', overflowY: 'scroll', overflowX: 'hidden', maxHeight: '600px' }}>
        {filteredItems.map((message, index) => (
          <Card.Body key={index}>
            <Card.Title>{message.sendername}:</Card.Title>
            {message.text && (() => {
              const match = message.text.match(filter);
              if (!match) {
                return (
                  <Button style={{ cursor: 'default', maxWidth: '60%' }} disabled>
                    <Card.Text>{message.text}</Card.Text>
                  </Button>
                );
              }

              const start = message.text.indexOf(match[0]);
              const end = start + match[0].length;

              return (
                <Button style={{ cursor: 'default', maxWidth: '60%' }} disabled>
                  <Card.Text>
                    {message.text.slice(0, start)}
                    <span style={{ color: 'black', fontWeight: 'bold', backgroundColor:'yellow' }}>{match[0]}</span>
                    {message.text.slice(end)}
                  </Card.Text>
                </Button>
              );
            })()}

            {message.image && (
              <Button style={{ cursor: 'default' }} disabled>
                <Image
                  src={message.image}
                  alt="Message content"
                  style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '5px' }}
                />
              </Button>
            )}
            {message.timestamp && (
              <Card.Subtitle style={{ marginTop: '2px' }}>{message.timestamp.slice(10,)}</Card.Subtitle>
            )}
          </Card.Body>
        ))}
      </Card>
      <MessageInput sendMessage={sendMessage} />
    </Container>
  );
}

export default ChatContainer;