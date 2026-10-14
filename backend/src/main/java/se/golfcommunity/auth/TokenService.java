package se.golfCommunity.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import se.golfCommunity.user.User;

import java.time.Duration;
import java.time.Instant;

@Service
public class TokenService {

    private static final String ISSUER = "golf-community-api";

    private final JwtEncoder jwtEncoder;
    private final Duration tokenValidity;

    public TokenService(JwtEncoder jwtEncoder,
                        @Value("${app.jwt.expiration-minutes}") long expirationMinutes) {
        this.jwtEncoder = jwtEncoder;
        this.tokenValidity = Duration.ofMinutes(expirationMinutes);
    }

    public String createToken(User user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .issuedAt(now)
                .expiresAt(now.plus(tokenValidity))
                .subject(String.valueOf(user.getId()))
                .claim("username", user.getUsername())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
