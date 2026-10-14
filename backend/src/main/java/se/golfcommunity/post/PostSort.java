package se.golfCommunity.post;

import org.springframework.data.domain.Sort;
import se.golfCommunity.common.BadRequestException;

import java.util.Locale;

/**
 * Tillåtna sorteringar. En vitlista i stället för att låta klienten skicka valfria fältnamn.
 * id används som andra sorteringsnyckel så att sidindelningen blir stabil.
 */
public enum PostSort {

    NEWEST(Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"))),
    OLDEST(Sort.by(Sort.Order.asc("createdAt"), Sort.Order.asc("id"))),
    TITLE(Sort.by(Sort.Order.asc("title").ignoreCase(), Sort.Order.asc("id")));

    private final Sort sort;

    PostSort(Sort sort) {
        this.sort = sort;
    }

    public Sort getSort() {
        return sort;
    }

    public static PostSort fromParam(String value) {
        if (value == null || value.isBlank()) {
            return NEWEST;
        }
        try {
            return valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Okänd sortering. Använd newest, oldest eller title.");
        }
    }
}
