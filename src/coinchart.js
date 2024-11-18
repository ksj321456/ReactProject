import React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Financial } from "chartjs-chart-financial";
import { Chart } from "react-chartjs-2";

ChartJS.register(...registerables, Financial);

const CoinChart = ({ coinName, chartData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (KRW)",
        },
      },
    },
  };

  // Dataset for candlestick data
  const candlestickDataset = {
    label: `${coinName} Price`,
    data: chartData.candlesticks,
    type: "candlestick",
    borderColor: "rgba(75, 192, 192, 1)",
  };

  // Dataset for moving average (example for 5-day MA)
  const maDataset = {
    label: `${coinName} MA`,
    data: chartData.movingAverage,
    type: "line",
    borderColor: "rgba(255, 99, 132, 1)",
    fill: false,
  };

  const data = {
    datasets: [candlestickDataset, maDataset],
  };

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <h2>{coinName} Price Chart</h2>
      <Chart type="candlestick" data={data} options={options} />
    </div>
  );
};

export default CoinChart;
