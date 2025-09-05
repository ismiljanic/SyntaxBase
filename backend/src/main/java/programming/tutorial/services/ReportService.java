package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Report;

import java.util.List;

public interface ReportService {
    Report createReport(Integer postId, String reporterId, String reason) throws Exception;

    List<Report> getAllUnresolvedReports();

    void markAsResolved(Integer reportId);
}
