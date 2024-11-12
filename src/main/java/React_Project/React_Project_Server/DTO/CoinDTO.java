package React_Project.React_Project_Server.DTO;

import React_Project.React_Project_Server.Entity.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoinDTO {
    private Long id;      // 코인의 기본키

    private String coinName;    // 코인 이름

    private double coinPrice;   // 코인 가격

    private long coinCount;     // 코인 갯수

    private boolean buy;        // true이면 매수한 것 false이면 매도한 것.

    private User user;
}
