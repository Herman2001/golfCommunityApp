package se.golfCommunity.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

/**
 * @EntityGraph hämtar författare och kategori i samma SQL-fråga och undviker N+1-problemet i listor.
 */
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

    @Override
    @EntityGraph(attributePaths = {"author", "category"})
    Page<Post> findAll(Specification<Post> specification, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Post> findByAuthorId(Long authorId, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Optional<Post> findWithDetailsById(Long id);
}
