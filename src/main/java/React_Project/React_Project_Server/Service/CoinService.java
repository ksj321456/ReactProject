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
        return coinRepository.findByUser(user);
    }

    public boolean buyCoins(CoinBuySaleDTO coinBuySaleDTO) {

        Optional<User> userOptional = userRepository.findByUserId(coinBuySaleDTO.getUserId());
        if (userOptional.isEmpty()) return true;

        User user = userOptional.get();

        Coin coin = Coin.builder().coinName(coinBuySaleDTO.getCoinName())
                .coinPrice(coinBuySaleDTO.getCoinPrice())
                .coinCount(coinBuySaleDTO.getCoinCount())
                .buy(coinBuySaleDTO.isBuy())
                .user(user)
                .build();

        try {
            coinRepository.save(coin);
        } catch (Exception e) {
            return false;
        }

        return true;
    }
}
