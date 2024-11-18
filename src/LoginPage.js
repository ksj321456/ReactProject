// LoginPage.js
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

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/login', { userId, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token); // Store token for authentication
                navigate('/main', {state: {
                    "userId": userId,
                    "nickname": response.data.nickname,
                    "balance": response.data.balance
                }})
            } else {
                setError('Invalid login credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Server error. Please try again later.');
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

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="login">로그인</button>
                </form>
                <button type="button" className="register" onClick={() => navigate('/register')}>
                    회원가입
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
