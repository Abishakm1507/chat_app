
import { Card, Row, Col, Image, Form, InputGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from "react-icons/io5";
import SearchIcon from '@mui/icons-material/Search';
const ChatNav = ({ userId, Username, userImage, filter, setFilter }) => {
    const navigate = useNavigate();
    return (
        <div>
            <Card className='position-fixed top-0 end-0' style={{ cursor: 'pointer', border: 'none', borderBottom: '1px solid grey', borderRadius: '0px', display: 'flex', width: (window.innerWidth >= 1000) ? '68%' : '100%', marginLeft: '30px', marginTop: '0' }}>
                <Row className='align-items-center p-2'>
                    <Col xs="auto">
                        <IoChevronBackOutline style={{ fontSize: '30px', textAlign: 'center', marginBottom: '5px' }} onClick={() => {
                            window.location.reload();
                        }} />
                        <Image src={userImage} alt="user" roundedCircle style={{ width: '50px', height: '50px', objectFit: 'cover' }} onClick={() => navigate('/userprofile')} />
                    </Col>
                    <Col onClick={() => navigate('/userprofile')}>
                        <Card.Body key={userId}>
                            <Card.Title>{Username}</Card.Title>
                        </Card.Body>
                    </Col>
                    <Col>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <InputGroup className="mb-3">
                            <Form.Control type="search" placeholder="Search..." value={filter} onChange={(e) => setFilter(e.target.value)}/>
                            <Button style={{ backgroundColor:"grey", border:'none'}}>
                                <SearchIcon />
                            </Button>
                        </InputGroup>
                    </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default ChatNav;