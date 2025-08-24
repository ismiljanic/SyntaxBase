package programming.tutorial.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.config.TestSecurityConfig;
import programming.tutorial.domain.InstructorRequest;
import programming.tutorial.domain.InstructorRequestStatus;
import programming.tutorial.services.InstructorRequestService;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InstructorRequestAdminController.class)
@Import(TestSecurityConfig.class)
class InstructorRequestAdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InstructorRequestService instructorRequestService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void approveRequest_shouldReturnOk_whenSuccessful() throws Exception {
        InstructorRequest instructorRequest = new InstructorRequest();
        instructorRequest.setId(1L);
        instructorRequest.setStatus(InstructorRequestStatus.APPROVED);

        when(instructorRequestService.updateRequestStatus(1L, InstructorRequestStatus.APPROVED)).thenReturn(instructorRequest);

        mockMvc.perform(put("/api/admin/instructor-requests/1/approved")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void approveRequest_shouldReturnNotFound() throws Exception {
        when(instructorRequestService.updateRequestStatus(1L, InstructorRequestStatus.APPROVED))
                .thenThrow(new RuntimeException("Request not found"));

        mockMvc.perform(put("/api/admin/instructor-requests/1/approved")
                        .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Request not found"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void approveRequest_ShouldReturnForbidden_WhenNotAdmin() throws Exception {
        mockMvc.perform(put("/api/admin/instructor-requests/1/approved"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void rejectRequest_ShouldReturnOk_WhenSuccessful() throws Exception {
        InstructorRequest request = new InstructorRequest();
        request.setId(2L);
        request.setStatus(InstructorRequestStatus.REJECTED);

        when(instructorRequestService.updateRequestStatus(eq(2L), eq(InstructorRequestStatus.REJECTED)))
                .thenReturn(request);

        mockMvc.perform(put("/api/admin/instructor-requests/2/rejected")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void rejectRequest_ShouldReturnNotFound() throws Exception {
        when(instructorRequestService.updateRequestStatus(eq(2L), eq(InstructorRequestStatus.REJECTED)))
                .thenThrow(new RuntimeException("Request not found"));

        mockMvc.perform(put("/api/admin/instructor-requests/2/rejected")
                        .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Request not found"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void rejectRequest_ShouldReturnForbidden_WhenNotAdmin() throws Exception {
        mockMvc.perform(put("/api/admin/instructor-requests/1/rejected"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getPendingRequests_ShouldReturnList() throws Exception {
        InstructorRequest request = new InstructorRequest();
        request.setId(3L);
        request.setStatus(InstructorRequestStatus.PENDING);

        when(instructorRequestService.getPendingRequests()).thenReturn(Collections.singletonList(request));

        mockMvc.perform(get("/api/admin/instructor-requests/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getPendingRequests_ShouldReturnForbidden_WhenNotAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/instructor-requests/pending"))
                .andExpect(status().isForbidden());
    }
}