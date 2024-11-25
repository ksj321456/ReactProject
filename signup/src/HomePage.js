import { useNavigate } from 'react-router-dom'; // useHistory 추가

function HomePage() {
    const navigate = useNavigate();
    const handleRegister = () => {
        navigate('/register'); // 홈으로 이동
    };

    return (
        <div>
            <h1>여기는 홈화면입니다.</h1>
            <button type="button" className="register" onClick={handleRegister}>회원가입</button>
        </div>
        
    );
}

export default HomePage;