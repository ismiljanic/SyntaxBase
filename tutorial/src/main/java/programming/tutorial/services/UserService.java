package programming.tutorial.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import programming.tutorial.domain.User;
import programming.tutorial.dto.UserDTO;

import java.util.Optional;


@Service
public interface UserService {

    ResponseEntity<?> addUser(UserDTO userDTO);

    Optional<User> findById(Integer userId);
    Optional<User> findByUsername(String username);

}