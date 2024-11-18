import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useHistory 추가
import axios from 'axios';
import './RegisterPage.css';
import 'font-awesome/css/font-awesome.min.css'; // Font Awesome 스타일 추가

function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [userId, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 상태 추가

    const validateForm = () => {
        // 아이디 유효성 검사
        const userIdRegex = /^[a-zA-Z0-9]{4,12}$/;
        if(!userIdRegex.test(userId)){
            alert('아이디는 4~12자 사이의 영문 대소문자 또는 숫자만 포함해야 합니다.');
            return false;
        }
        // 비밀번호 유효성 검사
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // 대문자, 소문자, 숫자, 특수문자 포함, 최소 8자
        if (!passwordRegex.test(password)) {
            alert('비밀번호는 최소 8자, 대문자, 소문자, 숫자 및 특수문자를 포함해야 합니다.');
            return false;
        }

        // 이메일 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 기본 이메일 형식
        if (!emailRegex.test(email)) {
            alert('유효한 이메일 주소를 입력하세요.');
            return false;
        }

        // 닉네임 유효성 검사
        if (nickname.length < 2) {
            alert('닉네임은 최소 2자 이상이어야 합니다.');
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return alert('비밀번호가 일치하지 않습니다.');
        }

        // 유효성 검사
        if (!validateForm()) {
            return;
        }

        const user = { name, userId, password, nickname, email };

        try {
            const response = await axios.post('http://localhost:8081/signup', user);
            alert('회원가입 성공: ' + response.data.nickname);
            setName(user.userId);
            navigate('/main', {state: {
                "userId": userId,
                "nickname": nickname,
                "balance": response.data.balance
            }});
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입 실패');
            window.location.reload();
        }
    };

    const handleCancel = () => {
        navigate('/'); // 홈으로 이동
    };

    return (
        <div className="container">
            <div className="form-container">
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                <label>이름:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder= "이름" required />
                
                <label>아이디:</label>
                <input type="userId" value={userId} onChange={(e) => setId(e.target.value)} placeholder= "아이디" required />
                
                <label>비밀번호:</label>
                <div className="input password">
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="비밀번호" 
                        required 
                    />
                    <div className="eyes" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`fa fa-${showPassword ? 'eye' : 'eye-slash'} fa-lg`}></i>
                    </div>
                </div>
                

                <label>비밀번호 확인:</label>
                <div className="input password">
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="비밀번호 확인" 
                        required 
                    />
                    <div className="eyes" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`fa fa-${showPassword ? 'eye' : 'eye-slash'} fa-lg`}></i>
                    </div>
                </div>

                <label>닉네임:</label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder= "닉네임" required />             

                <label>이메일:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder= "이메일" required />
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" className="cancel" onClick={handleCancel}>취소</button>
                    <button type="submit" className="signup">회원가입</button>    
                </div>
            </form>
            </div>
        </div>
    );
}

export default RegisterPage;