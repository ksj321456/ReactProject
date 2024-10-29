import { useNavigate } from 'react-router-dom'; // useHistory 추가
import React from 'react';
function HomePage() {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login'); // 홈으로 이동
    };

    return (
        <div>
            <h1>가상화폐 모의투자시스템</h1>
            <button type="button" className="login" onClick={handleLogin}>로그인</button>
        </div>
        
    );
}

export default HomePage;