import React, { useEffect, useState } from "react";
import axios from "axios";
import RefreshButton from './RefreshButton';
import { useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";

const CoinTable = () => {
  const [data, setData] = useState([]);
  const [isRankAsc, setIsRankAsc] = useState(true);
  const [isPriceAsc, setIsPriceAsc] = useState(true);
  const [isMarketCapAsc, setIsMarketCapAsc] = useState(true);
  const [isPercentChangeAsc, setIsPercentChangeAsc] = useState(true);
  const [isVolumeAsc, setIsVolumeAsc] = useState(true);

  const location = useLocation();
  const userData = { ...location.state };
  const [userId, setUserID] = useState(userData.userId);
  const [nickname, setNickname] = useState(userData.nickname);
  const [balance, setBalance] = useState(userData.balance);

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://api.coinpaprika.com/v1/tickers?quotes=KRW");
      setData(response.data.slice(0, 100));
      alert(`코인 데이터를 가져왔습니다.`)
    } catch (error) {
      alert("데이터 출력 오류");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/main?userId=${userId}`);
      if (response.status === 200) {
        setUserID(response.data.userId);
        setNickname(response.data.nickname);
        setBalance(response.data.balance);
        console.log(`response data: ${response.data}`);
      } else {
        alert("서버 전송 오류");
      }
    } catch (error) {
      alert("서버 전송 오류");
      console.log(error);
    }
  };

  const formatNumber = (number) => {
    if (number >= 1_000_000_000_000) return (number / 1_000_000_000_000).toFixed(2) + "조";
    if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(2) + "억";
    if (number >= 1_000_000) return (number / 1_000_000).toFixed(2) + "백만";
    return number.toLocaleString();
  };

  const handleSort = (key, isAsc, setIsAsc) => {
    const sortedData = [...data].sort((a, b) => {
      const aValue = key.split('.').reduce((o, i) => o[i], a);
      const bValue = key.split('.').reduce((o, i) => o[i], b);
      return isAsc ? bValue - aValue : aValue - bValue;
    });
    setData(sortedData);
    setIsAsc(!isAsc);
  };

  const handleSortRank = () => handleSort("rank", isRankAsc, setIsRankAsc);
  const handleSortPrice = () => handleSort("quotes.KRW.price", isPriceAsc, setIsPriceAsc);
  const handleSortMarketCap = () => handleSort("quotes.KRW.market_cap", isMarketCapAsc, setIsMarketCapAsc);
  const handleSortPercentChange = () => handleSort("quotes.KRW.percent_change_24h", isPercentChangeAsc, setIsPercentChangeAsc);
  const handleSortVolume24h = () => handleSort("quotes.KRW.volume_24h", isVolumeAsc, setIsVolumeAsc);

  return (
    <div>
      <h1>100개의 코인 테이블 (KRW)</h1>
      <UserInfo userId={userId} nickname={nickname} balance={balance} />
      <RefreshButton onClick={fetchData} />
      <table border="1">
        <thead>
          <tr>
            <th onClick={handleSortRank} style={{ cursor: "pointer" }}>
              순위 {isRankAsc ? "▲" : "▼"}
            </th>
            <th>티커</th>
            <th>이름</th>
            <th onClick={handleSortPrice} style={{ cursor: "pointer" }}>
              가격 (KRW) {isPriceAsc ? "▲" : "▼"}
            </th>
            <th onClick={handleSortMarketCap} style={{ cursor: "pointer" }}>
              총 가치 (KRW) {isMarketCapAsc ? "▲" : "▼"}
            </th>
            <th onClick={handleSortPercentChange} style={{ cursor: "pointer" }}>
              24시간 변동률 (%) {isPercentChangeAsc ? "▲" : "▼"}
            </th>
            <th onClick={handleSortVolume24h} style={{ cursor: "pointer" }}>
              24시간 거래량 (KRW) {isVolumeAsc ? "▲" : "▼"}
            </th>
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
              <td style={{ color: crypto.quotes.KRW.percent_change_24h > 0 ? "red" : "skyblue" }}>
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
