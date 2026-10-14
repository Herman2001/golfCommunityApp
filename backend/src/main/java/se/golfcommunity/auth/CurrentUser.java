package se.golfCommunity.auth;

import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Hjälpmetod för att läsa ut den inloggade användarens id ur token (sub-claimet).
 */
public final class CurrentUser {

    private CurrentUser() {
    }

    public static Long id(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}
