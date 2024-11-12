package React_Project.React_Project_Server.Service;

import React_Project.React_Project_Server.DTO.LogInUserDTO;
import React_Project.React_Project_Server.DTO.SignUpUserDTO;
import React_Project.React_Project_Server.DTO.UserDTO;
import React_Project.React_Project_Server.Entity.User;
import React_Project.React_Project_Server.Repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Data
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;


    public boolean signUp(SignUpUserDTO signUpUserDTO) {
        System.out.println("서비스 회원가입 시작");
        // 아이디가 DB에 있는지 확인
        Optional<User> existingUser = userRepository.findByUserId(signUpUserDTO.getUserId());

        if (existingUser.isPresent()) {
            System.out.println("서비스 회원가입 실패");
            return false;
        }

        signUpUserDTO.setBalance(500000);
        User user = User.builder()
                        .password(signUpUserDTO.getPassword())
                        .email(signUpUserDTO.getEmail()).nickname(signUpUserDTO.getNickname()).name(signUpUserDTO.getName())
                .balance(signUpUserDTO.getBalance())
                .build();
        userRepository.save(user);
        System.out.println("서비스 회원가입 성공");
        return true;
    }

    // 회원가입 시 에러 필드값과 메세지를 저장하는 map을 반환하는 Service
    public Map<String, String> signUpErrorHandling(Errors errors) {
        Map<String, String> map = new HashMap<>();

        for(FieldError error : errors.getFieldErrors()) {
            map.put(error.getField(), error.getDefaultMessage());
        }
        return map;
    }

    public Map<String, String> logInErrorHandling(Errors errors) {
        Map<String, String> map = new HashMap<>();

        for (FieldError error : errors.getFieldErrors()) {
            map.put(error.getField(), error.getDefaultMessage());
        }
        return map;
    }

    public User logIn(LogInUserDTO logInUserDTO) {
        Optional<User> userOptional;

        if ((userRepository.existsByUserId(logInUserDTO.getUserId()) && userRepository.existsByPassword(logInUserDTO.getPassword()))) {
            userOptional = userRepository.findByUserId(logInUserDTO.getUserId());
        }
        else {
            return null;
        }
        User user = userOptional.get();
        return user;
    }
}

