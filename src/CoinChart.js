import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// 필요한 요소들을 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinChart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coinData = location.state;
  const [coinName, setCoinName] = useState(coinData.coinName);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartInstance, setChartInstance] = useState(null);
  const [timeRange, setTimeRange] = useState(7); // 기본값: 7일
  // CoinTable 컴포넌트로부터 전달받은 현재 코인 가격
  const [coinPrice, setCoinPrice] = useState(coinData.coinPrice)
  // 매수, 매도할 코인 갯수
  const [coinCount, setCoinCount] = useState(1);
  // 현재 계정의 ID
  const [userId, setUserId] = useState(coinData.userId);

  const ONE_COIN_PRICE = coinData.coinPrice

  useEffect(() => {
    if (!coinName) {
      setLoading(false);
    } else {
      fetchChartData(coinName, timeRange);
    }
    // 이전 차트가 있으면 파괴
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [coinName, timeRange]); // timeRange가 변경될 때마다 차트 데이터 재요청

  const fetchChartData = async (coinName, days) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=krw&days=${days}`
      );
      const data = response.data;

      // 날짜 및 가격 데이터 처리
      const labels = data.prices.map((entry) =>
        new Date(entry[0]).toLocaleDateString()
      );
      const prices = data.prices.map((entry) => entry[1]);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: `${coinName.toUpperCase()} 가격 변동 (KRW)`,
            data: prices,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error("차트 데이터를 가져오는 중 오류 발생:", error);
      setLoading(false);
    }
  };

  if (!coinName) {
    return <p>코인 데이터가 전달되지 않았습니다.</p>;
  }

  const descendingCoinCount = () => {
    setCoinCount(coinCount - 1);
    setCoinPrice(coinPrice - coinData.coinPrice)
    if (coinCount < 1) {
      setCoinCount(0);
      setCoinPrice(0);
    }
  }

  const ascendingCoinCount = () => {
    setCoinCount(coinCount + 1);
    setCoinPrice(coinPrice + coinData.coinPrice)
  }

  // 매수할 때 실행할 함수
  const buyCoins = async ({userId, coinName, coinPrice, coinCount}) => {

    coinPrice = coinPrice / coinCount;

      const coinBuyObject = {
        userId,
        coinName,
        coinPrice,
        coinCount,
        buy: true
      }

      console.log("보내는 데이터:", coinBuyObject); // 요청 데이터 출력

      try {
         const response = await axios.post(`http://localhost:8081/buyCoins`, coinBuyObject)
          if (response.status === 200) {
            alert(`구입에 성공하였습니다.`)
            navigate('/main', {state: {"userId": userId}})
          } else {
            alert(`구입에 실패하였습니다. 보유 잔고를 확인해주세요.`)
          }
        }
      catch (error) {
        console.error(`서버 오류: ${error.response.data}`)
      }
  }

  const sellCoins = async ({userId, coinName, coinPrice, coinCount}) => {

    coinPrice = coinPrice / coinCount;

    const coinSellObject = {
      userId,
      coinName,
      coinPrice,
      coinCount,
      buy: false
    }

    console.log(`보내는 데이터: ${coinSellObject}`);

    try {
      const response = await axios.post(`http://localhost:8081/sellCoins`, coinSellObject);
      if (response.status === 200) {
        alert(`판매에 성공했습니다.`);
        navigate('/main', {state: {"userId": userId}})
      }
    }
    catch(error) {
      console.error(error.toString());
      alert(`판매에 실패했습니다. 보유 중인 코인 갯수를 확인해주세요.`);
    }
  }

  const CoinCountChange = (e) => {
    const value = Math.max(0, e.target.value); // 0보다 작은 값은 입력 불가
    setCoinCount(value);
    setCoinPrice(value * coinData.coinPrice); // 가격을 갯수에 맞춰 계산
  };

  return (
    <div>
  <h2>{coinName.toUpperCase()} 차트</h2>
  <h3>현재 가격: {coinPrice.toLocaleString()}원</h3>
  <label>매수, 매도 갯수</label>
  <input type="text" value={coinCount} maxLength={4} onChange={CoinCountChange}></input>
  <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
    <button onClick={() => ascendingCoinCount()}>▲</button>
    <button className="buy-button" onClick={() => buyCoins({ userId, coinName, coinPrice, coinCount })}>매수</button>
  </div>
  <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "0px" }}>
    <button onClick={descendingCoinCount}>▼</button>
    <button className="sell-button" onClick={() => sellCoins({ userId, coinName, coinPrice, coinCount })}>매도</button>
  </div>
  <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "5px" }}>
    <button onClick={() => setTimeRange(1)}>1일</button>
    <button onClick={() => setTimeRange(7)}>7일</button>
    <button onClick={() => setTimeRange(30)}>30일</button>
    <button onClick={() => setTimeRange(365)}>1년</button>
  </div>
  {loading ? (
    <p>차트 데이터를 불러오는 중...</p>
  ) : (
    <Line data={chartData} />
  )}
</div>

  );
};

export default CoinChart;