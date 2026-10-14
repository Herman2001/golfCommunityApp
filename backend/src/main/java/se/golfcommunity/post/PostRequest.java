package se.golfCommunity.post;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * Används både när ett inlägg skapas (POST) och när det uppdateras (PUT).
 * PUT ersätter hela inlägget, så ett tomt fält (t.ex. price) tar bort värdet.
 */
public record PostRequest(
        @NotBlank(message = "Ange en rubrik.")
        @Size(max = 120, message = "Rubriken får vara högst 120 tecken.")
        String title,

        @NotBlank(message = "Skriv något i inlägget.")
        @Size(max = 5000, message = "Inlägget får vara högst 5000 tecken.")
        String body,

        @NotNull(message = "Välj en kategori.")
        Long categoryId,

        @Size(max = 500, message = "Bildlänken är för lång.")
        String imageUrl,

        @PositiveOrZero(message = "Priset kan inte vara negativt.")
        @Max(value = 1_000_000, message = "Priset är för högt.")
        Integer price,

        @Size(max = 100, message = "Platsen får vara högst 100 tecken.")
        String location
) {
}
