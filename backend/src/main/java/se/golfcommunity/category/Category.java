package se.golfCommunity.category;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    /**
     *  Ett URL vänligt namn som inte har å,ä,ö. Används för filtrering
     * */
    @Column(nullable = false, unique = true, length = 50)
    private String slug;

    public Category(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }
}
