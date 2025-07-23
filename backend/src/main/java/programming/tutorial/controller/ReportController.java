package programming.tutorial.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Report;
import programming.tutorial.dto.PostDTO;
import programming.tutorial.dto.ReportRequestDTO;
import programming.tutorial.dto.ReportResponseDTO;
import programming.tutorial.services.ReportService;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<?> reportPost(@RequestBody ReportRequestDTO dto) throws Exception {
        reportService.createReport(dto.getPostId(), dto.getReporterId(), dto.getReason());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponseDTO>> getReports() {
        List<Report> reports = reportService.getAllUnresolvedReports();

        List<ReportResponseDTO> dtoList = reports.stream().map(report -> {
            Integer parentPostId = (report.getPost().getParentPost() != null)
                    ? report.getPost().getParentPost().getId()
                    : report.getPost().getId();

            return new ReportResponseDTO(
                    report.getId(),
                    report.getPost().getId(),
                    report.getPost().getContent(),
                    report.getPost().getUserId(),
                    parentPostId,
                    report.getReporterId(),
                    report.getReason(),
                    report.getCreatedAt()
            );
        }).toList();

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resolveReport(@PathVariable Long id) {
        reportService.markAsResolved(Math.toIntExact(id));
        return ResponseEntity.ok().build();
    }
}
