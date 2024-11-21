package React_Project.React_Project_Server.Controller;

import React_Project.React_Project_Server.DTO.CoinBuySaleDTO;
import React_Project.React_Project_Server.DTO.CoinDTO;
import React_Project.React_Project_Server.Entity.Coin;
import React_Project.React_Project_Server.Entity.User;
import React_Project.React_Project_Server.Service.CoinService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Data
public class CoinController {

    private final CoinService coinService;

    // 해당 userId에 해당하는 코인들을 Coin으로 준다.
    @GetMapping("/getCoinList")
    public List<Coin> getUserIdCoinList(@RequestParam(name = "userId") String userId) {
        return coinService.getCoinList(userId);
    }

    // 반환값으로 User 정보를 던져줌 => 업데이트된 User의 정보를 클라이언트에서 반환하기 위해
    @PostMapping("/buyCoins")
    public ResponseEntity<?> buyCoins(@RequestBody CoinBuySaleDTO coinBuySaleDTO) {
        System.out.println("리액트로부터 전달받은 코인 객체 " + coinBuySaleDTO);
        User user = coinService.buyCoins(coinBuySaleDTO);
        if (user == null) {
            return ResponseEntity.badRequest().body("잔액 부족");
        }
        return ResponseEntity.ok().body(user);
    }

    // 매도 버튼 요청이 왔을 때 처리
    @PostMapping("/sellCoins")
    public ResponseEntity<?> sellCoin(@RequestBody CoinBuySaleDTO coinBuySaleDTO) {
        try {
            User user = coinService.sellCoins(coinBuySaleDTO);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("코인 판매 실패");
        }
    }

}
