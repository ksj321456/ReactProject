package React_Project.React_Project_Server.Service;

import React_Project.React_Project_Server.DTO.CoinBuySaleDTO;
import React_Project.React_Project_Server.Entity.Coin;
import React_Project.React_Project_Server.Entity.User;
import React_Project.React_Project_Server.Repository.CoinRepository;
import React_Project.React_Project_Server.Repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Data
@RequiredArgsConstructor
public class CoinService {

    private final CoinRepository coinRepository;
    private final UserRepository userRepository;

    // Repository로부터 받은 Coin 리스트를 Controller에  반환
    public List<Coin> getCoinList(String userId) {
        // 전달받은 userId로 해당하는 User 객체 반환
        Optional<User> userOptional = userRepository.findByUserId(userId);

        // userOptional에 null 값이 들어왔다면 빈 리스트 반환
        if (userOptional.isEmpty()) return Collections.emptyList();

        User user = userOptional.get();
        List<Coin> coinList = coinRepository.findByUser(user);
        return coinList;
    }

    public User buyCoins(CoinBuySaleDTO coinBuySaleDTO) {

        Optional<User> userOptional = userRepository.findByUserId(coinBuySaleDTO.getUserId());
        if (userOptional.isEmpty()) return null;

        User user = userOptional.get();

        // 코인 매매기록 저장
        Coin coin = Coin.builder().coinName(coinBuySaleDTO.getCoinName())
                .coinPrice(coinBuySaleDTO.getCoinPrice())
                .coinCount(coinBuySaleDTO.getCoinCount())
                .buy(coinBuySaleDTO.isBuy())
                .user(user)
                .build();

        // 코인 매매하고 남은 돈을 새로 저장해야함
        double balance = user.getBalance();
        // 코인을 사고 난 후에 남은 금액
        double balanceResult = balance - (coinBuySaleDTO.getCoinCount() * coinBuySaleDTO.getCoinPrice());

        // 돈이 부족할 경우
        if (balanceResult < 0) {
            throw new IllegalArgumentException("잔액 부족으로 코인을 구입할 수 없습니다.");
        }

        // 코인을 산 후 남은 금액 저장
        user.setBalance(balanceResult);

        try {
            coinRepository.save(coin);
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("데이터베이스 저장 중 오류 발생: " + e.getMessage());
        }

        return user;
    }

    public User sellCoins(CoinBuySaleDTO coinBuySaleDTO) {
        Optional<User> userOptional = userRepository.findByUserId(coinBuySaleDTO.getUserId());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User 찾을 수 없음");
        }

        User user = userOptional.get();

        Optional<Coin> coinOptional = coinRepository.findByUserAndCoinName(user, coinBuySaleDTO.getCoinName());
        if (coinOptional.isEmpty()) {
            throw new RuntimeException("Coin 찾을 수 없음");
        }
        Coin coin = coinOptional.get();

        // 판매하고자 하는 코인의 수보다 갖고 있는 코인이 적다면 Exception 발생
        if (coin.getCoinCount() < coinBuySaleDTO.getCoinCount()) {
            throw new RuntimeException("코인 갯수 부족");
        }

        // 코인의 갯수 업데이트
        coin.setCoinCount(coin.getCoinCount() - coinBuySaleDTO.getCoinCount());

        // 코인의 갯수가 0이면 해당 instance DB에서 삭제, 그렇지 않으면 그냥 update
        if (coin.getCoinCount() == 0) {
            coinRepository.delete(coin);
        } else {
            coinRepository.save(coin);
        }

        // 판매 수익
        double profit = coinBuySaleDTO.getCoinCount() * coinBuySaleDTO.getCoinPrice();
        user.setBalance(user.getBalance() + profit);
        userRepository.save(user);
        return user;
    }
}
