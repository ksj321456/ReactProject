import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import UserInfo from './UserInfo';
import CoinList from './CoinList';
import './Portfolio.css';

const Portfolio = () => {
    const location = useLocation();
    const userData = { ...location.state };
    const [userId, setUserID] = useState(userData.userId);
    const [nickname, setNickname] = useState(userData.nickname);
    const [balance, setBalance] = useState(userData.balance);

    useEffect(() => {
        fetchUserData(); // 사용자 데이터 가져오기
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/main?userId=${userId}`);
            if (response.status === 200) {
                setUserID(response.data.userId);
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
