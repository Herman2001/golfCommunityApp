package se.golfCommunity.post;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Bygger WHERE-villkoren för sökningen. Varje filter läggs bara till om det är ifyllt,
 * så sökord, kategori och sortering kan kombineras fritt.
 */
public final class PostSpecifications {

    private PostSpecifications() {
    }

    public static Specification<Post> matches(String categorySlug, String query) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categorySlug != null && !categorySlug.isBlank()) {
                predicates.add(cb.equal(root.get("category").get("slug"), categorySlug.trim()));
            }

            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.<String>get("title")), pattern),
                        cb.like(cb.lower(root.<String>get("body")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
