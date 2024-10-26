package React_Project.React_Project_Server.Service;

import React_Project.React_Project_Server.DTO.UserDTO;
import React_Project.React_Project_Server.Entity.User;
import React_Project.React_Project_Server.Repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Data
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public boolean signUp(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByUserId(userDTO.getUserId());

        if (existingUser.isPresent()) {
            return false;
        }

        userDTO.setBalance(500000);
        User user = modelMapper.map(userDTO, User.class);
        userRepository.save(user);
        return true;
    }

    public User logIn(UserDTO userDTO) {
        Optional<User> userOptional;

        if ((userRepository.existsByUserId(userDTO.getUserId()) && userRepository.existsByPassword(userDTO.getPassword()))) {
            userOptional = userRepository.findByUserId(userDTO.getUserId());
        }
        else {
            return null;
        }
        User user = userOptional.get();
        return user;
    }
}

