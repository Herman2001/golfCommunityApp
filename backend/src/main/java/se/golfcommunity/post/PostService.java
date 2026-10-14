package se.golfCommunity.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.golfCommunity.category.Category;
import se.golfCommunity.category.CategoryRepository;
import se.golfCommunity.comment.CommentRepository;
import se.golfCommunity.common.BadRequestException;
import se.golfCommunity.common.ForbiddenException;
import se.golfCommunity.common.NotFoundException;
import se.golfCommunity.common.PageResponse;
import se.golfCommunity.user.User;
import se.golfCommunity.user.UserService;

@Service
@Transactional(readOnly = true)
public class PostService {

    private static final int MAX_PAGE_SIZE = 50;

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;

    public PostService(PostRepository postRepository,
                       CategoryRepository categoryRepository,
                       CommentRepository commentRepository,
                       UserService userService) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.commentRepository = commentRepository;
        this.userService = userService;
    }

    public PageResponse<PostResponse> search(String query, String categorySlug, String sort, int page, int size) {
        Pageable pageable = PageRequest.of(validPage(page), validSize(size), PostSort.fromParam(sort).getSort());
        Page<Post> posts = postRepository.findAll(PostSpecifications.matches(categorySlug, query), pageable);
        return PageResponse.from(posts, PostResponse::from);
    }

    public PageResponse<PostResponse> findByAuthor(Long authorId, int page, int size) {
        Pageable pageable = PageRequest.of(validPage(page), validSize(size), PostSort.NEWEST.getSort());
        return PageResponse.from(postRepository.findByAuthorId(authorId, pageable), PostResponse::from);
    }

    public PostResponse findById(Long id) {
        return PostResponse.from(getPostWithDetails(id));
    }

    @Transactional
    public PostResponse create(PostRequest request, Long userId) {
        User author = userService.getAuthenticatedUser(userId);
        Category category = getCategory(request.categoryId());

        Post post = new Post(request.title().trim(), request.body().trim(), category, author);
        applyOptionalFields(post, request);

        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public PostResponse update(Long id, PostRequest request, Long userId) {
        Post post = getPostWithDetails(id);
        requireOwner(post, userId);

        post.setTitle(request.title().trim());
        post.setBody(request.body().trim());
        post.setCategory(getCategory(request.categoryId()));
        applyOptionalFields(post, request);

        // saveAndFlush så att updatedAt hinner sättas innan svaret byggs.
        return PostResponse.from(postRepository.saveAndFlush(post));
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> postNotFound());
        requireOwner(post, userId);

        commentRepository.deleteAllByPostId(id);
        postRepository.delete(post);
    }

    private Post getPostWithDetails(Long id) {
        return postRepository.findWithDetailsById(id)
                .orElseThrow(() -> postNotFound());
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BadRequestException("Kategorin finns inte."));
    }

    private void requireOwner(Post post, Long userId) {
        if (!post.isOwnedBy(userId)) {
            throw new ForbiddenException("Du kan bara ändra dina egna inlägg.");
        }
    }

    private void applyOptionalFields(Post post, PostRequest request) {
        post.setImageUrl(blankToNull(request.imageUrl()));
        post.setPrice(request.price());
        post.setLocation(blankToNull(request.location()));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private static int validPage(int page) {
        return Math.max(page, 0);
    }

    private static int validSize(int size) {
        return Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
    }

    private static NotFoundException postNotFound() {
        return new NotFoundException("Inlägget finns inte.");
    }
}
