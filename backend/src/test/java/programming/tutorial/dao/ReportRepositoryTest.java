package programming.tutorial.dao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Report;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
class ReportRepositoryTest {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Report unresolvedReport1;
    private Report unresolvedReport2;
    private Report resolvedReport;
    private Post post;

    @BeforeEach
    void setup() {
        post = new Post();
        post.setContent("Content");
        post.setDeleted(false);
        post.setUserId("auth0|123");
        entityManager.persist(post);

        unresolvedReport1 = new Report();
        unresolvedReport1.setResolved(false);
        unresolvedReport1.setPost(post);
        unresolvedReport1.setReason("Report reason 1");
        unresolvedReport1.setCreatedAt(LocalDateTime.now().minusDays(1));
        entityManager.persist(unresolvedReport1);

        unresolvedReport2 = new Report();
        unresolvedReport2.setResolved(false);
        unresolvedReport2.setPost(post);
        unresolvedReport2.setReason("Report reason 2");
        unresolvedReport2.setCreatedAt(LocalDateTime.now());
        entityManager.persist(unresolvedReport2);

        resolvedReport = new Report();
        resolvedReport.setResolved(true);
        resolvedReport.setPost(post);
        resolvedReport.setReason("Report resolved");
        resolvedReport.setCreatedAt(LocalDateTime.now().minusDays(2));
        entityManager.persist(resolvedReport);

        entityManager.flush();
    }

    @Test
    void testFindByResolvedFalseOrderByCreatedAtDesc_returnsOnlyUnresolvedReports() {
        List<Report> reports = reportRepository.findByResolvedFalseOrderByCreatedAtDesc();

        assertThat(reports).hasSize(2);
        assertThat(reports.get(0).getCreatedAt()).isAfter(reports.get(1).getCreatedAt());
        assertThat(reports).doesNotContain(resolvedReport);
    }

    @Test
    void testFindByResolvedFalseOrderByCreatedAtDesc_emptyWhenNoUnresolvedReports() {
        unresolvedReport1.setResolved(true);
        unresolvedReport2.setResolved(true);
        entityManager.flush();

        List<Report> reports = reportRepository.findByResolvedFalseOrderByCreatedAtDesc();
        assertThat(reports).isEmpty();
    }
}