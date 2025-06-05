package programming.tutorial.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import programming.tutorial.domain.User;
import programming.tutorial.dto.*;
import programming.tutorial.services.impl.UserNotFoundException;

import java.util.List;
import java.util.Optional;


@Service
public interface UserService {

    ResponseEntity<?> addUser(UserDTO userDTO);

    Optional<User> findById(Integer userId);

    Optional<User> findByUsername(String username);

    void updateName(String userId, String name);

    void updateUsername(String userId, String username);

    void updateSurname(String userId, String lastName);

    public void deleteUser(String userId, String password);

    User findByAuth0UserId(String auth0UserId);

    UserAccountDTO getUserAccountInformation(String auth0UserId);

    List<UserDTO> getAllUsers();

    Optional<UserIdDTO> getUserIdByAuth0Id(String auth0Id);

    Optional<String> getUserRoleByAuth0Id(String auth0UserId);

    ResponseEntity<?> syncAuth0User(Auth0UserDTO auth0User, String auth0UserId);
}