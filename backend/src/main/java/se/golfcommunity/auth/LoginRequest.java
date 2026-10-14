package se.golfCommunity.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Ange din e-postadress.")
        String email,

        @NotBlank(message = "Ange ditt lösenord.")
        String password
) {
}
