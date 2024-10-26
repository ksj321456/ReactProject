package React_Project.React_Project_Server.Controller;

import React_Project.React_Project_Server.DTO.UserDTO;
import React_Project.React_Project_Server.Entity.User;
import React_Project.React_Project_Server.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Data
@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;
    private final String SESSION_ID = "LOGIN_ID";

    @PostMapping("/signup")
    public ResponseEntity signUp(@RequestBody UserDTO userDTO) {

        if (userService.signUp(userDTO)) {
            return new ResponseEntity(HttpStatus.OK);
        }
        else {
            return new ResponseEntity(HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity logIn(@RequestBody UserDTO userDTO, HttpServletRequest request) {
        User user = userService.logIn(userDTO);

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
