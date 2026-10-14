package se.golfCommunity.post;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import se.golfCommunity.auth.CurrentUser;
import se.golfCommunity.common.PageResponse;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * Exempel: GET /api/posts?q=driver&category=fragor&sort=newest&page=0&size=20
     */
    @GetMapping
    public PageResponse<PostResponse> search(
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return postService.search(query, category, sort, page, size);
    }

    @GetMapping("/{id}")
    public PostResponse findById(@PathVariable("id") Long id) {
        return postService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse create(@Valid @RequestBody PostRequest request,
                               @AuthenticationPrincipal Jwt jwt) {
        return postService.create(request, CurrentUser.id(jwt));
    }

    @PutMapping("/{id}")
    public PostResponse update(@PathVariable("id") Long id,
                               @Valid @RequestBody PostRequest request,
                               @AuthenticationPrincipal Jwt jwt) {
        return postService.update(id, request, CurrentUser.id(jwt));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id, @AuthenticationPrincipal Jwt jwt) {
        postService.delete(id, CurrentUser.id(jwt));
    }
}
