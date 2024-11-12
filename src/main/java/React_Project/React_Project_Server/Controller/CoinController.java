package React_Project.React_Project_Server.Controller;

import React_Project.React_Project_Server.DTO.CoinBuySaleDTO;
import React_Project.React_Project_Server.DTO.CoinDTO;
import React_Project.React_Project_Server.Entity.Coin;
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

    @PostMapping("/buyCoins")
    public ResponseEntity<?> buyCoins(@RequestBody CoinBuySaleDTO coinBuySaleDTO) {
        if (coinService.buyCoins(coinBuySaleDTO)) return new ResponseEntity<>(HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

}
