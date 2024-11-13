import React, { useEffect, useState } from "react";
import axios from "axios";
import RefreshButton from './RefreshButton'; // RefreshButton import
import { useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";

const CoinTable = () => {
  const [data, setData] = useState([]);
  const [isRankAsc, setIsRankAsc] = useState(true); // 정렬 상태를 관리하는 상태 변수
  const location = useLocation();
  const userData = {...location.state};

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, []);

  // 데이터 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await axios.get("https://api.coinpaprika.com/v1/tickers?quotes=KRW");
      setData(response.data.slice(0, 100));
    } catch (error) {
      alert("데이터 출력 오류");
    }
  };

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

  // 순위 열을 클릭할 때 데이터를 정렬하는 함수
  const handleSortRank = () => {
    const sortedData = [...data].sort((a, b) =>
      isRankAsc ? b.rank - a.rank : a.rank - b.rank
    );
    setData(sortedData);
    setIsRankAsc(!isRankAsc); // 정렬 방향을 토글
  };

  // 새로고침 핸들러
  const handleReload = () => {
    fetchData();
    alert("코인 데이터를 다시 가져왔습니다.")
  };

  return (
    <div>
      <h1>100개의 코인 테이블 (KRW)</h1>
      <UserInfo userId={userData.userId} nickname={userData.nickname} balance={userData.balance} />
      <RefreshButton onClick={handleReload} />
      <table border="1">
        <thead>
          <tr>
            <th onClick={handleSortRank} style={{ cursor: "pointer" }}>
              순위 {isRankAsc ? "▲" : "▼"}
            </th>
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
                  color: crypto.quotes.KRW.percent_change_24h > 0 ? "red" : "skyblue",
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