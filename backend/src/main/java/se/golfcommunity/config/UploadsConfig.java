package se.golfCommunity.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

/**
 * Gör att filerna i uppladdningsmatten kan hämtas på /uploads/filnamn
 */
@Configuration
public class UploadsConfig implements WebMvcConfigurer {

    private final String uploadLocation;

    public UploadsConfig(@Value("${app.uploads.dir}") String uploadsDir) {
        String location = Path.of(uploadsDir).toAbsolutePath().normalize().toUri().toString();
        this.uploadLocation = location.endsWith("/") ? location : location + "/";
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**").addResourceLocations(uploadLocation);
    }
}
