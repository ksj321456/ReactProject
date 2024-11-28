import { useNavigate } from 'react-router-dom'; // useHistory 추가
import React from 'react';
function HomePage() {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login'); // 로그인으로 이동
    };

    const handleRegister = () => {
        navigate('/register'); // 회원가입으로 이동
    };
    
    return (
        <div className="container">
            <div className="overlay">
            <h1>가상화폐 모의투자시스템</h1>
            <button type="button" className="login" onClick={handleLogin}>로그인</button>
            <button type="button" className="register" onClick={handleRegister}>회원가입</button>
        </div>
        </div>
        
    );
}

export default HomePage;