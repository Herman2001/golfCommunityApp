package se.golfCommunity.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.Map;

/**
 * Samma felformat för alla fel i API:t, så att appen kan tolka dem på ett ställe.
 * fieldErrors finns bara med vid valideringsfel, t.ex. { "title": "Ange en rubrik." }.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(int status, String message, Map<String, String> fieldErrors, Instant timestamp) {

    public static ErrorResponse of(HttpStatus status, String message) {
        return of(status, message, null);
    }

    public static ErrorResponse of(HttpStatus status, String message, Map<String, String> fieldErrors) {
        return new ErrorResponse(status.value(), message, fieldErrors, Instant.now());
    }
}
