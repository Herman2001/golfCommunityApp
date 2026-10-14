package se.golfCommunity.user;

public record AuthorResponse(Long id, String username) {

    public static AuthorResponse from(User user) {
        return new AuthorResponse(user.getId(), user.getUsername());
    }
}
