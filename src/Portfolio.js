import React, { useEffect, useState } from "react";
import axios from "axios";
import UserInfo from './UserInfo';
import CoinList from './CoinList';
import { useNavigate } from 'react-router-dom';
import './Portfolio.css';

const Portfolio = () => {
    const [userId, setUserID] = useState(localStorage.getItem('userId'));
    const [nickname, setNickname] = useState('');
    const [balance, setBalance] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData(); // 사용자 데이터 가져오기
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/main?userId=${userId}`);
            if (response.status === 200) {
                setNickname(response.data.nickname);
                setBalance(response.data.balance);
            } else {
                throw new Error("서버 전송 오류");
            }
        } catch (error) {
            console.log(error);
        } 
    };

    return (
        <div>
            <button type="button" className="main" onClick={() => navigate('/main')}>
                    메인으로
            </button>
            <h1>Portfolio</h1>
            <header>
                <UserInfo userId={userId} nickname={nickname} balance={balance} />
            </header>
            <div>
                <hr />
                <CoinList />
            </div>
        </div>
    );
};

export default Portfolio;
