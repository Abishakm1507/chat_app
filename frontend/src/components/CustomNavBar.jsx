import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Form } from 'react-bootstrap';
import { IoSettingsSharp } from "react-icons/io5";

const CustomNavBar = ({filter, setFilter}) => {
    const navigate = useNavigate();
    
    return (
        <Navbar>
            <Container>
                <Navbar.Brand><strong>Chat App</strong></Navbar.Brand>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Form.Control type="search" placeholder="Search..." value={filter} onChange={(e) => setFilter(e.target.value)} />
                </Form>
                <Nav>
                    <Nav.Link onClick={() => navigate('/settings')}><IoSettingsSharp style={{ fontSize: '25px' }} /></Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default CustomNavBar;