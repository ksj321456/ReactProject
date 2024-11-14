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

        // 유효성 검사를 통과하지 못한다면
        if (errors.hasErrors()) {
            Map<String, String> map = userService.signUpErrorHandling(errors);
            return ResponseEntity.badRequest().body(map);
        }

        User user = userService.signUp(signUpUserDTO);
        // 유효성 검사 통과 후 회원정보 DB에 저장 후 OK 코드 반환
        // 반환받은 user 객체가 null이 아니라면
        if (user != null) {

            // 회원가입 성공 후 userId 세션에 저장
            // 세션 생성
            HttpSession session = request.getSession(true);
            // 세션에 값 넣기
            session.setAttribute(signUpUserDTO.getUserId(), USER);
            // OK 상태코드와 user 객체 클라이언트에 반환
            return ResponseEntity.ok().body(user);
        }
        // 회원가입 실패 시 400 상태 코드와 body에 null값 반환
        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody @Valid LogInUserDTO logInUserDTO, Errors errors, HttpServletRequest request) {

        // 이미 세션에 등록되어 있다면 바로 로그인 처리
        HttpSession session = request.getSession(false);  // 세션이 없으면 null 반환
        if (session != null && session.getAttribute(logInUserDTO.getUserId()) == USER) {
            // 세션이 존재하고, 이미 로그인 되어 있으면 바로 유저 정보를 반환
            return ResponseEntity.ok().body(userService.getByUserId(logInUserDTO.getUserId()));
        }

        // 로그인 시 유효성 검사 실패했을 때
        if (errors.hasErrors()) {
            Map<String, String> map = userService.logInErrorHandling(errors);
            return ResponseEntity.badRequest().body(map);
        }

        // 유효성 검사 성공
        User user = userService.logIn(logInUserDTO);

        // DB에 저장된 회원이 없다면 400 상태 코드와 null 값 반환
        if (user == null) {
            return ResponseEntity.badRequest().body(null);
        }

        // Service layer에서 데이터를 받아왔을 경우 -> 세션 생성
        // 처음 로그인이므로 빈 값의 session 생성
        if (session == null) {
            session = request.getSession();  // 세션이 없으면 새로 생성
        }

        // key 값으로 userId, value 값으로 USER
        session.setAttribute(user.getUserId(), USER);

        return ResponseEntity.ok().body(user);
    }

    @GetMapping("/main")
    public ResponseEntity<?> showUserData(@RequestParam(name = "userId") String userId) {
        User user = userService.getByUserId(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok().body(user);
    }


}
