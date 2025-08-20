package programming.tutorial.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.ReportRepository;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Report;
import programming.tutorial.services.impl.ReportServiceJpa;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;
    @Mock
    private PostRepository postRepository;
    @InjectMocks
    ReportServiceJpa reportServiceJpa;

    @Test
    void createReport_throwsExceptionWhenPostNotFound() {
        when(postRepository.findById(1)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () ->
                reportServiceJpa.createReport(1, "id", "reason"));

        assertEquals("Post not found", exception.getMessage());
        verify(reportRepository, never()).save(any(Report.class));
    }

    @Test
    void createReport_succesfullyCreateReport() throws Exception {
        Post post = new Post();
        post.setId(1);

        when(postRepository.findById(1)).thenReturn(Optional.of(post));
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Report report = reportServiceJpa.createReport(1, "user123", "spam");

        assertNotNull(report);
        assertEquals(post, report.getPost());
        assertEquals("user123", report.getReporterId());
        assertEquals("spam", report.getReason());

        verify(postRepository).findById(1);
        verify(reportRepository).save(any(Report.class));
    }

    @Test
    void getAllUnresolvedReports_returnsList() {
        Report report1 = new Report();
        report1.setId(1);
        report1.setResolved(false);
        report1.setCreatedAt(LocalDateTime.now());

        Report report2 = new Report();
        report2.setId(2);
        report2.setResolved(false);
        report2.setCreatedAt(LocalDateTime.now().minusHours(1));

        when(reportRepository.findByResolvedFalseOrderByCreatedAtDesc()).thenReturn(List.of(report1, report2));

        List<Report> result = reportServiceJpa.getAllUnresolvedReports();

        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getId());
        verify(reportRepository).findByResolvedFalseOrderByCreatedAtDesc();
    }

    @Test
    void markAsResolved_throwsRuntimeExceptionWhenNotFound() {
        when(reportRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException runtimeException = assertThrows(RuntimeException.class, () ->
                reportServiceJpa.markAsResolved(1));

        assertEquals("Report not found", runtimeException.getMessage());
        verify(reportRepository, never()).save(any(Report.class));
    }

    @Test
    void markAsResolved_marksReportAndSaves() {
        Report report = new Report();
        report.setId(1);
        report.setResolved(false);

        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));

        reportServiceJpa.markAsResolved(1);

        assertTrue(report.isResolved());
        verify(reportRepository).save(report);
    }
}
