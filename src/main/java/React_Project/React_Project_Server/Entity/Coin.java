package React_Project.React_Project_Server.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;      // 코인의 기본키

    private String coinName;    // 코인 이름

    private double coinPrice;   // 코인 가격

    private long coinCount;     // 코인 갯수

    private boolean buy;        // true이면 매수한 것 false이면 매도한 것.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
