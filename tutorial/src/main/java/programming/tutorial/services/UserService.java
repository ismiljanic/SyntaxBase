package programming.tutorial.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import programming.tutorial.domain.User;
import programming.tutorial.dto.UserDTO;
import programming.tutorial.dto.UserUpdateRequest;
import programming.tutorial.services.impl.UserNotFoundException;

import java.util.Optional;


@Service
public interface UserService {

    ResponseEntity<?> addUser(UserDTO userDTO);
    Optional<User> findById(Integer userId);
    Optional<User> findByUsername(String username);
    public void updateName(Long userId, String name);
    public void updateUsername(Long userId, String username);
    public void updateSurname(Long userId, String lastName);
    public void changePassword(Long userId, String currentPassword, String newPassword);
    public void deleteUser(Long userId, String password);
    User getUserById(String id) throws UserNotFoundException;
}