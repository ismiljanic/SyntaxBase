package programming.tutorial.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.stereotype.Component;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.User;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class CustomJwtAuthenticationConverter extends JwtAuthenticationConverter {

    @Autowired
    private UserRepository userRepository;

    protected List<GrantedAuthority> extractAuthorities(Jwt jwt) {
        String auth0UserId = jwt.getClaimAsString("sub");
        Optional<User> userOpt = userRepository.findByAuth0UserId(auth0UserId);

        if (userOpt.isEmpty()) {
            return Collections.emptyList();
        }

        String role = userOpt.get().getRole().name();
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }
}
