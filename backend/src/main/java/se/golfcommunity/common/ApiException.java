package se.golfCommunity.common;

import org.springframework.http.HttpStatus;

/**
 * Basklass för fel som ska nå klienten med en viss HTTP-status och ett begripligt meddelande.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
