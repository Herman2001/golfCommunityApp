package se.golfCommunity.image;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import se.golfCommunity.common.BadRequestException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

/**
 * Sparar uppladdade bilder poåp disk och returnerer adressen de kan hämtas från.
 */
@Service
public class ImageStorageService {

    // De tillåtna bildtyperna och filändeler de får.
    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final Path uploadDir;

    public ImageStorageService(@Value("${app.uploads.dir}") String uploadDir) throws IOException {
        this.uploadDir = Paths.get(uploadDir);
        Files.createDirectories(this.uploadDir);
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Filen är tom, vvälj en fil att ladda upp.");
        }

        String extension = ALLOWED_TYPES.get(file.getContentType());
        if (extension == null) {
            throw new BadRequestException("Bilden måste vara i fromatet, JPEG, PNG eller WEBP.");
        }

        String filename = UUID.randomUUID() + extension;

        try {
            file.transferTo(uploadDir.resolve(filename));
        } catch (IOException e) {
            throw new IllegalStateException("Kunde inte spara bilden", e);
        }

        return "/uploads/" + filename;
    }

    public String storeSeedImage(String resourcePath) {
        String filename = UUID.randomUUID() + ".jpg";
        try (InputStream in = new ClassPathResource(resourcePath).getInputStream()) {
            Files.copy(in, uploadDir.resolve(filename));
        } catch (IOException e) {
            throw new IllegalStateException("Kunde inte spara bilden", e);
        }
        return "/uploads/" + filename;
    }
}
