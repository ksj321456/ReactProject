package React_Project.React_Project_Server.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;    // User의 기본키

    // User의 이름
    private String name;

    // User의 아이디
    private String userId;

    // User의 비밀번호
    private String password;

    // User의 닉네임
    private String nickname;

    // User의 이메일
    private String email;

    // 계좌 잔액
    private double balance;
}
