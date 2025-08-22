package programming.tutorial.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.config.TestSecurityConfig;
import programming.tutorial.domain.Post;
import programming.tutorial.domain.Report;
import programming.tutorial.dto.ReportRequestDTO;
import programming.tutorial.services.ReportService;

@WebMvcTest(ReportController.class)
@Import(TestSecurityConfig.class)
class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReportService reportService;

    private ReportRequestDTO reportRequest;

    @BeforeEach
    void setUp() {
        reportRequest = new ReportRequestDTO();
        reportRequest.setPostId(1);
        reportRequest.setReporterId("auth0|123");
        reportRequest.setReason("Inappropriate content");
    }

    @Test
    @WithMockUser(roles = "USER")
    void reportPost_ShouldReturnOk() throws Exception {
        mockMvc.perform(post("/api/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reportRequest)))
                .andExpect(status().isOk());

        verify(reportService).createReport(reportRequest.getPostId(), reportRequest.getReporterId(), reportRequest.getReason());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getReports_ShouldReturnList() throws Exception {
        Post post = new Post();
        post.setId(1);
        post.setContent("Sample post");
        post.setUserId("auth0|999");

        Report report = new Report();
        report.setId(10);
        report.setPost(post);
        report.setReporterId("auth0|123");
        report.setReason("Spam");
        report.setCreatedAt(LocalDateTime.now());

        when(reportService.getAllUnresolvedReports()).thenReturn(List.of(report));

        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(10))
                .andExpect(jsonPath("$[0].postId").value(1))
                .andExpect(jsonPath("$[0].postContent").value("Sample post"))
                .andExpect(jsonPath("$[0].reporterId").value("auth0|123"))
                .andExpect(jsonPath("$[0].reason").value("Spam"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getReports_ShouldReturnForbidden_ForNonAdmin() throws Exception {
        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void resolveReport_ShouldReturnOk() throws Exception {
        mockMvc.perform(post("/api/reports/{id}/resolve", 10))
                .andExpect(status().isOk());

        verify(reportService).markAsResolved(10);
    }

    @Test
    void resolveReport_ShouldReturnForbidden_ForNonAdmin() throws Exception {
        mockMvc.perform(post("/api/reports/{id}/resolve", 10))
                .andExpect(status().isForbidden());
    }
}