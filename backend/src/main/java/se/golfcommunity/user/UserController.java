package se.golfCommunity.user;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.golfCommunity.auth.CurrentUser;
import se.golfCommunity.common.PageResponse;
import se.golfCommunity.post.PostResponse;
import se.golfCommunity.post.PostService;

/**
 * Den inloggade användarens egna data (profil och "Mina inlägg").
 */
@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;
    private final PostService postService;

    public UserController(UserService userService, PostService postService) {
        this.userService = userService;
        this.postService = postService;
    }

    @GetMapping
    public UserResponse me(@AuthenticationPrincipal Jwt jwt) {
        return UserResponse.from(userService.getAuthenticatedUser(CurrentUser.id(jwt)));
    }

    @GetMapping("/posts")
    public PageResponse<PostResponse> myPosts(@AuthenticationPrincipal Jwt jwt,
                                              @RequestParam(name = "page", defaultValue = "0") int page,
                                              @RequestParam(name = "size", defaultValue = "20") int size) {
        return postService.findByAuthor(CurrentUser.id(jwt), page, size);
    }
}
