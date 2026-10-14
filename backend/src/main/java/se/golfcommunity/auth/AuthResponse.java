package se.golfCommunity.auth;

import se.golfCommunity.user.UserResponse;

/**
 * Svar vid login och registrering. Appen sparar token i SecureStore och skickar den som
 * "Authorization: Bearer <token>" vid skyddade anrop.
 */
public record AuthResponse(String token, UserResponse user) {
}
