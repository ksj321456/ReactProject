package React_Project.React_Project_Server.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id     // 기본키 지정
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    private String userId;    // User의 아이디

    // User의 이름
    private String name;

    // User의 비밀번호
    private String password;

    // User의 닉네임
    private String nickname;

    // User의 이메일
    private String email;

    // 계좌 잔액
    private double balance;

    @OneToMany(mappedBy = "user")
    private List<Coin> coinList;
}
