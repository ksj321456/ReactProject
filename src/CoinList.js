import React, { useEffect, useState } from 'react';
import './CoinList.css'
import axios from 'axios';
import { useLocation } from "react-router-dom";

function CoinList({userId}) {
    const [coins, setCoins] = useState([]);
    const [currentPrices, setCurrentPrices] = useState({});
    useEffect(() => {
        if(userId){
            fetchCoins();
        }
        fetchData();
    }, [userId]);


    const fetchCoins = async () => {
        try {
            const response = await axios.get('http://localhost:8081/getCoinList?userId=${userId}');
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
                prices[crypto.name] = crypto.quotes.KRW.price;
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
                    </tr>
                </thead>
                <tbody>
                    
                    {coins.map((coin, index) => (
                        <tr key={index}>
                            <td>{coin.name}</td>
                            <td>{coin.price.toLocaleString()}</td>
                            <td>{currentPrices[coin.name] ? currentPrices[coin.name].toLocaleString() : "N/A"}</td>
                            <td
                                style={{
                                    color: ((currentPrices[coin.name]/coin.price)*100 - 100).toFixed(2) > 0 ? "blue" : "red",
                                  }}>
                                {((currentPrices[coin.name]/coin.price)*100 - 100).toFixed(2)}%
                            </td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default CoinList;