package se.golfCommunity.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.golfCommunity.common.ConflictException;
import se.golfCommunity.common.UnauthorizedException;
import se.golfCommunity.user.User;
import se.golfCommunity.user.UserRepository;
import se.golfCommunity.user.UserResponse;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        String username = request.username().trim();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Det finns redan ett konto med den e-postadressen.");
        }
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ConflictException("Användarnamnet är upptaget.");
        }

        User user = userRepository.save(new User(username, email, passwordEncoder.encode(request.password())));
        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.email()))
                .filter(found -> passwordEncoder.matches(request.password(), found.getPasswordHash()))
                .orElseThrow(() -> new UnauthorizedException("Fel e-postadress eller lösenord."));

        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(tokenService.createToken(user), UserResponse.from(user));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
