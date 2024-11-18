import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const coinData = location.state;
  const [coinName, setCoinName] = useState(coinData.coinName);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartInstance, setChartInstance] = useState(null);
  const [timeRange, setTimeRange] = useState(7); // 기본값: 7일

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

  return (
    <div>
      <h2>{coinName.toUpperCase()} 차트</h2>
      <div>
        {/* 버튼 추가 */}
        <button onClick={() => setTimeRange(1)}>1일</button>
        <button onClick={() => setTimeRange(7)}>7일</button>
        <button onClick={() => setTimeRange(30)}>30일</button>
        <button onClick={() => setTimeRange(365)}>1년</button>
      </div>
      {loading ? (<p>차트 데이터를 불러오는 중...</p>) : ( <Line data={chartData} /> )}
    </div>
  );
};

export default CoinChart;
