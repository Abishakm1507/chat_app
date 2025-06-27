import CustomButton from '../components/CustomButton';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
    const navigate = useNavigate();
    return(
        <div style={{ alignItems:'center', textAlign:'center', justifyContent:"center", marginTop:'20%'}}>
            <h2>Chat Application</h2>
            <CustomButton onclick={() => navigate('/login')} label="Login" color="primary"/>
            <CustomButton onclick={() => navigate('/signup')} label="Sign Up" color="secondary" />
        </div>
    )
}

export default GetStarted;