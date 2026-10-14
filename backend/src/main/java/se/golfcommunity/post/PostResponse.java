package se.golfCommunity.post;

import se.golfCommunity.category.CategoryResponse;
import se.golfCommunity.user.AuthorResponse;

import java.time.Instant;

public record PostResponse(
        Long id,
        String title,
        String body,
        CategoryResponse category,
        AuthorResponse author,
        String imageUrl,
        Integer price,
        String location,
        Instant createdAt,
        Instant updatedAt
) {

    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getBody(),
                CategoryResponse.from(post.getCategory()),
                AuthorResponse.from(post.getAuthor()),
                post.getImageUrl(),
                post.getPrice(),
                post.getLocation(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
