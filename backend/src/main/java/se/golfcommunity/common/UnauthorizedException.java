package se.golfCommunity.common;

import org.springframework.http.HttpStatus;

/**
 * 401 – klienten bör behandla detta som "utloggad" och be användaren logga in igen.
 */
public class UnauthorizedException extends ApiException {

    public UnauthorizedException(String message) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}
