import React, { useEffect, useState } from "react";
import "./css/CoinList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CoinList() {
  const navigate = useNavigate();

  const [userId, setUserID] = useState(localStorage.getItem("userId"));

  const [coins, setCoins] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});

  useEffect(() => {
    fetchUserData();
    if (userId) {
      fetchCoins();
    }
    fetchData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      console.log(`userId = ${userId}`);
      const response = await axios.get(
        `http://localhost:8081/main?userId=${userId}`
      );
      if (response.status === 200) {
        setUserID(response.data.userId);
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
      const response = await axios.get(
        `http://localhost:8081/getCoinList?userId=${userId}`
      );
      setCoins(response.data);
    } catch (error) {
      alert("코인 목록 데이터 출력 오류");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.coinpaprika.com/v1/tickers?quotes=KRW"
      );
      const prices = {};
      response.data.forEach((crypto) => {
        prices[crypto.name.toLowerCase()] = crypto.quotes.KRW.price;
      });
      setCurrentPrices(prices);
    } catch (error) {
      alert("데이터 출력 오류");
    }
  };

  const getTotalCoinPrice = () => {
    return coins.reduce((sum, coin) => sum + coin.coinCount * coin.coinPrice, 0);
  };

  const getTotalCurrentPrice = () => {
    return coins.reduce((sum, coin) => {
      const currentPrice = currentPrices[coin.coinName];
      return sum + (currentPrice ? coin.coinCount * currentPrice : 0);
    }, 0);
  };

  const getProfitOrLoss = () => {
    return getTotalCurrentPrice() - getTotalCoinPrice();
  };

  return (
    <div>
      <h2>내가 보유한 코인 목록</h2>
      <h3>
        총 보유 코인 가격: {getTotalCoinPrice().toLocaleString()} 원
        <br />
        총 현재 코인 가격: {getTotalCurrentPrice().toLocaleString()} 원
        <br />
        총 변동률: 
        <span
          style={{
            color:
              ((getTotalCurrentPrice() / getTotalCoinPrice()) * 100 - 100) > 0
                ? "red"
                : "blue",
            marginLeft: "10px",
          }}
        >
          {((getTotalCurrentPrice() / getTotalCoinPrice()) * 100 - 100).toFixed(2)}
          %
        </span>
        <br />
        총 수익:&nbsp;
        <span
          style={{
            color: getProfitOrLoss() >= 0 ? "red" : "blue",
          }}
        >
          {getProfitOrLoss() >= 0
            ? `+${getProfitOrLoss().toLocaleString()} 원`
            : `-${getProfitOrLoss().toLocaleString()} 원`}
        </span>
      </h3>

      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>가격(KRW)</th>
            <th>현재가격</th>
            <th>변동률</th>
            <th>변동 금액</th>
            <th>개수</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => {
            const currentPrice = currentPrices[coin.coinName];
            const changeAmount =
              currentPrice && currentPrice * coin.coinCount -
              coin.coinPrice * coin.coinCount;

            return (
              <tr key={index}>
                <td
                  onClick={() =>
                    navigate("/chart", {
                      state: {
                        coinName: coin.coinName.toLowerCase(),
                        coinPrice: coin.coinPrice,
                        userId: userId,
                      },
                    })
                  }
                >
                  {coin.coinName}
                </td>
                <td>{coin.coinPrice.toLocaleString()}</td>
                <td>
                  {currentPrice
                    ? currentPrice.toLocaleString()
                    : "N/A"}
                </td>
                <td
                  style={{
                    color:
                      ((currentPrice / coin.coinPrice) * 100 - 100).toFixed(2) >=
                      0
                        ? "red"
                        : "blue",
                  }}
                >
                  {currentPrice
                    ? ((currentPrice / coin.coinPrice) * 100 - 100).toFixed(2)
                    : "N/A"}
                  %
                </td>
                <td
                  style={{
                    color: changeAmount >= 0 ? "red" : "blue",
                  }}
                >
                  {changeAmount
                    ? changeAmount.toLocaleString()
                    : "N/A"}
                  원
                </td>
                <td>{coin.coinCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CoinList;
