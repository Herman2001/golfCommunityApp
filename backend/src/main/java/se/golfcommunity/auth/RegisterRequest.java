package se.golfCommunity.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Ange ett användarnamn.")
        @Size(min = 3, max = 30, message = "Användarnamnet måste vara 3–30 tecken.")
        @Pattern(regexp = "^[A-Za-z0-9_]+$", message = "Användarnamnet får bara innehålla a–z, siffror och _.")
        String username,

        @NotBlank(message = "Ange en e-postadress.")
        @Email(message = "Ange en giltig e-postadress.")
        @Size(max = 254, message = "E-postadressen är för lång.")
        String email,

        // BCrypt använder högst 72 byte, därför maxgränsen.
        @NotBlank(message = "Ange ett lösenord.")
        @Size(min = 8, max = 72, message = "Lösenordet måste vara 8–72 tecken.")
        String password
) {
}
