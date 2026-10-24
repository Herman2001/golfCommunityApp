package se.golfCommunity.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import se.golfCommunity.category.Category;
import se.golfCommunity.category.CategoryRepository;
import se.golfCommunity.comment.Comment;
import se.golfCommunity.comment.CommentRepository;
import se.golfCommunity.image.ImageStorageService;
import se.golfCommunity.post.Post;
import se.golfCommunity.post.PostRepository;
import se.golfCommunity.user.User;
import se.golfCommunity.user.UserRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

/**
 * Körs vid uppstart. Kategorierna skapas alltid om de saknas.
 * Demodata (användare, inlägg, kommentarer) skapas bara om app.seed.demo-data=true och inga inlägg finns.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String DEMO_PASSWORD = "demo1234";

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageStorageService imageStorageService;
    private final boolean seedDemoData;

    public DataSeeder(CategoryRepository categoryRepository,
                      UserRepository userRepository,
                      PostRepository postRepository,
                      CommentRepository commentRepository,
                      PasswordEncoder passwordEncoder,
                      ImageStorageService imageStorageService,
                      @Value("${app.seed.demo-data:false}") boolean seedDemoData) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
        this.imageStorageService = imageStorageService;
        this.seedDemoData = seedDemoData;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedCategories();
        if (seedDemoData && postRepository.count() == 0) {
            seedDemoContent();
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) {
            return;
        }
        categoryRepository.saveAll(List.of(
                new Category("Frågor", "fragor"),
                new Category("Köp & sälj", "kop-salj"),
                new Category("Spelpartner", "spelpartner"),
                new Category("Banor & tips", "banor-tips")
        ));
        log.info("Skapade standardkategorier");
    }

    private void seedDemoContent() {
        User demo = findOrCreateUser("demo", "demo@golfcommunity.se");
        User golfaren = findOrCreateUser("golfaren", "golfaren@golfcommunity.se");

        Category questions = category("fragor");
        Category buySell = category("kop-salj");
        Category partner = category("spelpartner");
        Category tips = category("banor-tips");

        Post driverQuestion = post("Vilken driver för hcp 20?",
                "Funderar på att byta ut min gamla driver. Spelar på hcp 20 och slicar gärna. "
                        + "Har någon tips på en förlåtande modell som inte kostar skjortan?",
                questions, demo, null, null, 2, null);

        Post ironSet = post("Säljes: järnset 5–PW, regular-skaft",
                "Välskött järnset, spelat två säsonger. Greppen bytta i våras. Kan mötas upp i Stockholm.",
                buySell, golfaren, 2500, "Stockholm", 5, "seed-images/golfklubbor.png");

        post("Söker spelpartner helger i södra Stockholm",
                "Hcp 14, spelar helst tidigt på lördagsmorgonen. Alla nivåer välkomna, det viktiga är att ha kul!",
                partner, demo, null, "Farsta", 9, null);

        post("Tips: spela banor i solnedgång",
                "Många klubbar har billigare twilight-greenfee på kvällarna. Perfekt för att få in en runda efter jobbet.",
                tips, golfaren, null, null, 26, "seed-images/sunset.jpg");

        post("Hur ofta byter ni grepp?",
                "Mina grepp känns hala efter en säsong. Hur ofta brukar ni byta, och gör ni det själva?",
                questions, golfaren, null, null, 50, null);

        post("Säljes: golfbag på ställ, nästan ny",
                "Lätt bärbag med 14 fack och regnhuva. Använd ett fåtal rundor, säljes då jag fått en vagnbag.",
                buySell, demo, 900, "Uppsala", 60, null);

        post("Någon som vill spela 9 hål efter jobbet?",
                "Hcp 22 och vill komma ut oftare på vardagskvällar. Kan spela tisdagar eller torsdagar efter kl 17.",
                partner, golfaren, null, "Solna", 72, null);

        post("Hur tränar ni på puttningen hemma?",
                "Tappar alldeles för många slag på greenen. Är en puttmatta värd pengarna, eller finns det bättre övningar?",
                questions, demo, null, null, 80, null);

        post("Tips: gå banan baklänges på rangen",
                "Spela banans hål i huvudet på rangen: välj klubba och mål precis som på banan. Mycket bättre träning än att slå 50 bollar med samma klubba.",
                tips, golfaren, null, null, 96, null);

        post("Köpes: vänsterhänta wedgar",
                "Letar efter en 52° och en 56° för vänsterhänta. Får gärna vara begagnade så länge spåren är okej.",
                buySell, golfaren, null, "Göteborg", 110, null);

        post("Fyrboll söker två spelare till lördag",
                "Vi är två som spelar 18 hål på lördag förmiddag och söker två till. Alla handicap välkomna, vi tar det lugnt.",
                partner, demo, null, "Täby", 120, null);

        post("Vad har ni för bollar på vintern?",
                "Lönar det sig att köpa mjukare bollar när det är kallt, eller märks ingen skillnad för en vanlig amatör?",
                questions, golfaren, null, null, 140, null);

        post("Säljes: avståndsmätare med slope",
                "Fungerar felfritt, nytt batteri och fodral ingår. Slope-funktionen går att stänga av för tävling.",
                buySell, demo, 1500, "Stockholm", 160, null);

        post("Tips: spela från de främre tee-utslagen",
                "Testa att flytta fram en tee ibland. Man får fler inspel med korta järn och rundan går snabbare. Roligare golf helt enkelt!",
                tips, demo, null, null, 190, null);

        post("Hur kommer man igång med tävlingsgolf?",
                "Har spelat i två år och vill testa en klubbtävling. Hur fungerar det med anmälan och vad behöver man tänka på?",
                questions, demo, null, null, 220, null);

        post("Söker träningskompis till rangen",
                "Vill träna mer strukturerat under hösten. Ses gärna en gång i veckan och filmar varandras sving.",
                partner, golfaren, null, "Nacka", 260, null);

        post("Säljes: golfskor storlek 43",
                "Vattentäta skor med mjuka dubbar, använda en säsong. Bra skick, säljes pga fel storlek.",
                buySell, golfaren, 450, "Västerås", 300, null);

        post("Tips: skriv ner statistik efter rundan",
                "Räkna fairways, greener och puttar efter varje runda. Efter några rundor ser man tydligt var slagen försvinner.",
                tips, demo, null, null, 340, null);

        commentRepository.saveAll(List.of(
                new Comment(driverQuestion, golfaren, "Kolla på en driver med draw-bias, det hjälper mot slicen."),
                new Comment(driverQuestion, demo, "Tack! Ska provslå några i helgen."),
                new Comment(ironSet, demo, "Finns de kvar? Vilket märke?")
        ));

        log.info("Skapade demodata. Logga in med demo@golfcommunity.se / {}", DEMO_PASSWORD);
    }

    private User findOrCreateUser(String username, String email) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(
                        new User(username, email, passwordEncoder.encode(DEMO_PASSWORD))));
    }

    private Category category(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalStateException("Kategorin saknas: " + slug));
    }

    private Post post(String title, String body, Category category, User author,
                      Integer price, String location, int hoursAgo, String imagePath) {
        Post post = new Post(title, body, category, author);
        post.setPrice(price);
        post.setLocation(location);
        post.setCreatedAt(Instant.now().minus(Duration.ofHours(hoursAgo)));
        if (imagePath != null) {
            post.setImageUrl(imageStorageService.storeSeedImage(imagePath));
        }
        return postRepository.save(post);
    }
}
