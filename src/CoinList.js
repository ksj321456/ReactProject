import React, { useEffect, useState } from 'react';
import './CoinList.css'
import axios from 'axios';

function CoinList() {
    const [userId, setUserID] = useState(localStorage.getItem('userId'));

    const [coins, setCoins] = useState([]);
    const [currentPrices, setCurrentPrices] = useState({});

    useEffect(() => {
        fetchUserData();
        if(userId){
            fetchCoins();
        }
        fetchData();
    }, [userId]);

    const fetchUserData = async () => {
        try {
          console.log(`userId = ${userId}`)
          const response = await axios.get(`http://localhost:8081/main?userId=${userId}`);
          if (response.status === 200) {
            console.log(`fetchUserData response.data = ${response.data}`);
            setUserID(response.data.userId);
            console.log(`response data: ${response.data}`);
          } else {
            alert("서버 전송 오류");
          }
        } catch (error) {
          alert("서버 전송 오류");
          console.log(error);
        }
      };


    const fetchCoins = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getCoinList?userId=${userId}`);
            setCoins(response.data);
        } catch (error) {
            alert("코인 목록 데이터 출력 오류");
        }
    };

    // 데이터 가져오는 함수
    const fetchData = async () => {
        try {
            const response = await axios.get("https://api.coinpaprika.com/v1/tickers?quotes=KRW");
            const prices = {};
            response.data.forEach(crypto => {
                prices[crypto.name.toLowerCase()] = crypto.quotes.KRW.price;
            });
            console.log("Current Prices: ", currentPrices);
            setCurrentPrices(prices);
        } catch (error) {
            alert("데이터 출력 오류");
        }
    };

    return (
        <div>
            <h1>내가 보유한 코인 목록</h1>
            <table>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>가격(KRW)</th>
                        <th>현재가격</th>
                        <th>변동률</th>
                        <th>개수</th>
                    </tr>
                </thead>
                <tbody>
                    {coins.map((coin, index) => (
                        <tr key={index}>
                            <td>{coin.coinName}</td>
                            <td>{coin.coinPrice.toLocaleString()}</td>
                            <td>{currentPrices[coin.coinName] ? currentPrices[coin.coinName].toLocaleString() : "N/A"}</td>
                            <td
                                style={{
                                    color: ((currentPrices[coin.coinName]/coin.coinPrice)*100 - 100).toFixed(2) > 0 ? "blue" : "red",
                                  }}>
                                {((currentPrices[coin.coinName]/coin.coinPrice)*100 - 100).toFixed(2)}%
                            </td> 
                            <td>{coin.coinCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default CoinList;