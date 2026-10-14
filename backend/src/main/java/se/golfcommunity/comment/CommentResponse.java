package se.golfCommunity.comment;

import se.golfCommunity.user.AuthorResponse;

import java.time.Instant;

public record CommentResponse(Long id, Long postId, String body, AuthorResponse author, Instant createdAt) {

    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getPost().getId(),
                comment.getBody(),
                AuthorResponse.from(comment.getAuthor()),
                comment.getCreatedAt()
        );
    }
}
