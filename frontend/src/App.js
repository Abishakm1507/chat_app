import './App.css';
import SignUp from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Onboarding from './pages/Onboarding.jsx';
import GetStarted from './pages/GetStarted.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Chat from './pages/Chat.jsx';
import UserProfile from './pages/ProfileUser.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
  const [windowSize, setWindowSize] = useState(0);
  useEffect(() =>{
    setInterval(() => {
      if(window.innerWidth !== windowSize) {
        setWindowSize(window.innerWidth)
    }},80)
  })
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/userprofile" element={<UserProfile />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
