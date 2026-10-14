package se.golfCommunity.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank(message = "Skriv en kommentar.")
        @Size(max = 1000, message = "Kommentaren får vara högst 1000 tecken.")
        String body
) {
}
