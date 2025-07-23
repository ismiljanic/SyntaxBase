package programming.tutorial.services.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import programming.tutorial.dao.PostRepository;
import programming.tutorial.dao.ReportRepository;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Report;
import programming.tutorial.services.ReportService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ReportServiceJpa implements ReportService {

    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private PostRepository postRepository;

    @Override
    public Report createReport(Integer postId, String reporterId, String reason) throws Exception {
        Post post = postRepository.findById(postId).orElseThrow(() -> new Exception("Post not found"));

        Report report = new Report();

        report.setPost(post);
        report.setReporterId(reporterId);
        report.setReason(reason);
        return reportRepository.save(report);
    }

    @Override
    public List<Report> getAllUnresolvedReports() {
        return reportRepository.findByResolvedFalseOrderByCreatedAtDesc();
    }

    @Override
    public void markAsResolved(Integer reportId) {
        Report report = reportRepository.findById(Long.valueOf(reportId))
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setResolved(true);
        reportRepository.save(report);
    }
}
