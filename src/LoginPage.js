import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    localStorage.clear();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/login', { userId, password });
            if (response.status === 200) {
                // 로그인 성공 시 로컬 스토리지에 userId 저장
                localStorage.setItem('userId', userId);
                console.log(`Login => userId: ${userId}`);
                navigate('/main', {
                    state: {
                        userId: userId,
                        nickname: response.data.nickname,
                        balance: response.data.balance,
                    },
                });
            }
        } catch (error) {
            alert('로그인에 실패하였습니다.');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>로그인</h1>
                <form onSubmit={handleLogin}>
                    <label>아이디:</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="아이디"
                        required
                    />

                    <label>비밀번호:</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            required
                        />
                        <div
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i
                                className={`fa fa-${showPassword ? 'eye' : 'eye-slash'} fa-lg`}
                            ></i>
                        </div>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="login">
                        로그인
                    </button>
                </form>
                <button
                    type="button"
                    className="register"
                    onClick={() => navigate('/register')}
                >
                    회원가입
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
