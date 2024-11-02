import React, { useEffect, useState } from "react";
import axios from "axios";

const CoinTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.coinpaprika.com/v1/tickers?quotes=KRW");
        setData(response.data.slice(0, 100));
      } catch (error) {
        alert("데이터 출력 오류")
      }
    };

    fetchData();
  }, []);

  // 숫자를 단위로 줄이는 함수
  const formatNumber = (number) => {
    if (number >= 1_000_000_000_000) {
      return (number / 1_000_000_000_000).toFixed(2) + "조";
    } else if (number >= 1_000_000_000) {
      return (number / 1_000_000_000).toFixed(2) + "억";
    } else if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(2) + "백만";
    } else {
      return number.toLocaleString();
    }
  };

  return (
    <div>
      <h1>100개의 코인 테이블 (KRW)</h1>
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
              <td>{crypto.name}</td>
              <td>{crypto.quotes.KRW.price.toLocaleString()}</td>
              <td>{formatNumber(crypto.quotes.KRW.market_cap)}</td>
              <td
                style={{
                  color: crypto.quotes.KRW.percent_change_24h > 0 ? "skyblue" : "red",
                }}
              >
                {crypto.quotes.KRW.percent_change_24h.toFixed(2)}%
              </td>
              <td>{formatNumber(crypto.quotes.KRW.volume_24h)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
