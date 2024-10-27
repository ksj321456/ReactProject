package React_Project.React_Project_Server.Controller;

import React_Project.React_Project_Server.DTO.LogInUserDTO;
import React_Project.React_Project_Server.DTO.SignUpUserDTO;
import React_Project.React_Project_Server.DTO.UserDTO;
import React_Project.React_Project_Server.Entity.User;
import React_Project.React_Project_Server.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Data
@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;
    private final String SESSION_ID = "LOGIN_ID";

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpUserDTO signUpUserDTO, Errors errors) {

        // 유효성 검사를 통과하지 못한다면
        if (errors.hasErrors()) {
            Map<String, String> map = userService.signUpErrorHandling(errors);
            // 에러가 발생한 필드값을 key로 오류 메세지를 value로 갖는 프론트엔드에 반환
            return ResponseEntity.badRequest().body(map);
        }
        // 유효성 검사 통과 후 회원정보 DB에 저장 후 OK 코드 반환
        userService.signUp(signUpUserDTO);
        return ResponseEntity.ok("Success");
    }

    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody @Valid LogInUserDTO logInUserDTO, Errors errors, HttpServletRequest request) {

        // 로그인 시 유효성 검사 실패했을 때
        if (errors.hasErrors()) {
            Map<String, String> map = userService.logInErrorHandling(errors);
            return ResponseEntity.badRequest().body(map);
        }

        // 유효성 검사 성공
        User user = userService.logIn(logInUserDTO);

        if (user == null) {
            return new ResponseEntity(HttpStatus.CONFLICT);
        }

        // Service layer에서 데이터를 받아왔을 경우 -> 세션 생성
        // 처음 로그인이므로 빈 값의 session 생성, session은 key, value 값
        HttpSession session = request.getSession();
        session.setAttribute(SESSION_ID, user.getId());
        return new ResponseEntity(HttpStatus.OK);
    }

}
