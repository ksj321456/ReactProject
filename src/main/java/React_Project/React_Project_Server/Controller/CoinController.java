package React_Project.React_Project_Server.Controller;

import React_Project.React_Project_Server.Entity.Coin;
import React_Project.React_Project_Server.Service.CoinService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
