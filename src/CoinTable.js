import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";
import CoinChart from "./coinchart";
import RefreshButton from "./RefreshButton";

const CoinTable = () => {
  const [data, setData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState(null);

  const location = useLocation();
  const userData = { ...location.state };
  const [userId, setUserID] = useState(userData.userId);
  const [nickname, setNickname] = useState(userData.nickname);
  const [balance, setBalance] = useState(userData.balance);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.coinpaprika.com/v1/tickers?quotes=KRW"
      );
      setData(response.data.slice(0, 100));
    } catch (error) {
      console.error("Error fetching coin data", error);
    }
  };

  const fetchChartData = async (coinId, coinName) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: "krw",
            days: "30",
          },
        }
      );

      const candlesticks = response.data.prices.map((price, index) => ({
        x: new Date(price[0]),
        o: response.data.prices[index][1],
        h: response.data.prices[index][1] * 1.02,
        l: response.data.prices[index][1] * 0.98,
        c: response.data.prices[index][1],
      }));

      const movingAverage = response.data.prices.map((price, index, array) => {
        if (index < 5) return null;
        const avg = array.slice(index - 5, index).reduce((sum, p) => sum + p[1], 0) / 5;
        return { x: new Date(price[0]), y: avg };
      }).filter((data) => data);

      const data = {
        candlesticks,
        movingAverage,
      };

      setSelectedCoin(coinName);
      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart data", error);
    }
  };

  return (
    <div>
      <h1>100개의 코인 테이블 (KRW)</h1>
      <UserInfo userId={userId} nickname={nickname} balance={balance} />
      <RefreshButton onClick={fetchData} />
      <table border="1">
        <thead>
          <tr>
            <th>순위</th>
            <th>티커</th>
            <th>이름</th>
            <th>가격 (KRW)</th>
            <th>총 가치 (KRW)</th>
            <th>24시간 변동률 (%)</th>
            <th>24시간 거래량 (KRW)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.rank}</td>
              <td>{crypto.symbol}</td>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => fetchChartData(crypto.id, crypto.name)}
              >
                {crypto.name}
              </td>
              <td>{crypto.quotes.KRW.price.toLocaleString()}</td>
              <td>{crypto.quotes.KRW.market_cap.toLocaleString()}</td>
              <td>{crypto.quotes.KRW.percent_change_24h.toFixed(2)}%</td>
              <td>{crypto.quotes.KRW.volume_24h.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCoin && chartData && (
        <CoinChart coinName={selectedCoin} chartData={chartData} />
      )}
    </div>
  );
};

export default CoinTable;