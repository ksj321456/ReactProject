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
    private final String USER = "USER";

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpUserDTO signUpUserDTO, Errors errors, HttpServletRequest request) {
        System.out.println("컨트롤러 회원가입");

        // 유효성 검사를 통과하지 못한다면
        if (errors.hasErrors()) {
            Map<String, String> map = userService.signUpErrorHandling(errors);
            // 에러가 발생한 필드값을 key로 오류 메세지를 value로 갖는 프론트엔드에 반환
            return ResponseEntity.badRequest().body(map);
        }
        // 유효성 검사 통과 후 회원정보 DB에 저장 후 OK 코드 반환
        if (userService.signUp(signUpUserDTO)) {
            System.out.println("컨트롤러 회원가입 성공");

            // 회원가입 성공 후 userId 세션에 저장
            // 세션 생성
            HttpSession session = request.getSession(true);
            // 세션에 값 넣기
            session.setAttribute(signUpUserDTO.getUserId(), USER);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        System.out.println("컨트롤러 회원가입 실패");
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody @Valid LogInUserDTO logInUserDTO, Errors errors, HttpServletRequest request) {

        // 이미 세션에 등록되어 있다면 바로 로그인 처리
        HttpSession session = request.getSession(false);
        if (session.getAttribute(logInUserDTO.getUserId()) == USER) return new ResponseEntity<>(HttpStatus.OK);

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
        session = request.getSession();

        // key 값으로 userId, value 값으로 USER
        session.setAttribute(user.getUserId(), USER);
        return new ResponseEntity(HttpStatus.OK);
    }

}
