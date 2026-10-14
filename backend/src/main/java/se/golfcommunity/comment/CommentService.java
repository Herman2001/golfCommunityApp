package se.golfCommunity.comment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.golfCommunity.common.ForbiddenException;
import se.golfCommunity.common.NotFoundException;
import se.golfCommunity.post.Post;
import se.golfCommunity.post.PostRepository;
import se.golfCommunity.user.User;
import se.golfCommunity.user.UserService;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserService userService;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserService userService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userService = userService;
    }

    public List<CommentResponse> findByPost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw postNotFound();
        }
        return commentRepository.findByPostIdOrderByCreatedAtAscIdAsc(postId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional
    public CommentResponse create(Long postId, CommentRequest request, Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(CommentService::postNotFound);
        User author = userService.getAuthenticatedUser(userId);

        Comment comment = commentRepository.save(new Comment(post, author, request.body().trim()));
        return CommentResponse.from(comment);
    }

    @Transactional
    public void delete(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Kommentaren finns inte."));
        if (!comment.isOwnedBy(userId)) {
            throw new ForbiddenException("Du kan bara ta bort dina egna kommentarer.");
        }
        commentRepository.delete(comment);
    }

    private static NotFoundException postNotFound() {
        return new NotFoundException("Inlägget finns inte.");
    }
}
