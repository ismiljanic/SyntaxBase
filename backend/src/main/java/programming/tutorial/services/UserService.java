package programming.tutorial.services;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import programming.tutorial.domain.Role;
import programming.tutorial.domain.Tier;
import programming.tutorial.domain.User;
import programming.tutorial.dto.*;
import programming.tutorial.services.impl.UserNotFoundException;

import java.util.List;
import java.util.Optional;


public interface UserService {

    ResponseEntity<?> addUser(UserDTO userDTO);

    Optional<User> findById(Integer userId);

    Optional<User> findByUsername(String username);

    void updateName(String userId, String name);

    void updateUsername(String userId, String username);

    void updateSurname(String userId, String lastName);

    void deleteUser(String userId);

    void deleteUserAsAdmin(String auth0UserId);

    User findByAuth0UserId(String auth0UserId);

    UserAccountDTO getUserAccountInformation(String auth0UserId);

    List<UserDTO> getAllUsers();

    Optional<UserIdDTO> getUserIdByAuth0Id(String auth0Id);
    Integer getUserId(String auth0Id);

    Optional<String> getUserRoleByAuth0Id(String auth0UserId);

    ResponseEntity<?> syncAuth0User(Auth0UserDTO auth0User, String auth0UserId);

    void setUserActiveStatus(String userId, boolean b);

    void updateUserRoles(String userId, Role roles);

    UserDTO getUserDTOByAuth0UserId(String auth0Id);

    UserAccountDTO getUserAccountDTOByAuth0UserId(String userId);

    void upgradeTier(String auth0Id, Tier tier);

    @Transactional
    void removeUserFromCourse(String userId, Integer courseId);

    boolean getUserActiveStatus(String auth0UserId);

    UserProfileDTO getUserProfile(String username);
}