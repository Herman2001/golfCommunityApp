package se.golfCommunity.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.golfCommunity.common.UnauthorizedException;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Hämtar användaren som en giltig token pekar på.
     * Finns hen inte längre (t.ex. efter att databasen nollställts) svarar vi 401,
     * så att appen loggar ut och ber användaren logga in igen.
     */
    public User getAuthenticatedUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Ditt konto hittades inte. Logga in igen."));
    }
}
