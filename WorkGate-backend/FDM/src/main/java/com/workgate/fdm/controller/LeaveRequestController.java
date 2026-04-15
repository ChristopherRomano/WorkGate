package com.workgate.fdm.controller;
import java.util.List;
import java.util.Optional;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;


import com.workgate.fdm.DTO.LeaveRequestRequest;
import com.workgate.fdm.model.Employee;
import com.workgate.fdm.repository.EmployeeRepository;
import com.workgate.fdm.repository.LeaveRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.workgate.fdm.model.AnnualLeaveRequest;
import com.workgate.fdm.model.STATUS;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class LeaveRequestController {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveRequestController(
            LeaveRequestRepository leaveRequestRepository,
            EmployeeRepository employeeRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/annualLeave")
    public List<AnnualLeaveRequest> getLeaveRequests(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String Username) {
        Employee employee = resolveEmployee(normaliseUsername(username, Username), "username");
        String employeeEmail = employee.getEmail();
        return leaveRequestRepository.findByEmployeeEmailOrderByCreationTimeDesc(employeeEmail);
    }

    @GetMapping("/annualLeave/manager")
    public List<AnnualLeaveRequest> getManagerLeaveRequests(@RequestParam String managerEmail) {
        Employee manager = resolveEmployee(managerEmail, "managerEmail");
        return leaveRequestRepository.findByManagerEmailOrderByCreationTimeDesc(manager.getEmail());
    }

    @PostMapping({"/createAnnualLeave", "/annualLeave", "/annualLeave/create"})
    public ResponseEntity<AnnualLeaveRequest> createAnnualLeaveRequest(@RequestBody LeaveRequestRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username is required.");
        }

        Employee employee = resolveEmployee(request.getUsername(), "username");
        LocalDate startDate = toLocalDate(request.getStartOfLeave());
        LocalDate endDate = toLocalDate(request.getEndOfLeave());

        if (request.getEndOfLeave() < request.getStartOfLeave()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endOfLeave cannot be before startOfLeave.");
        }

        if (startDate.isBefore(LocalDate.now()) || endDate.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Leave dates cannot be in the past.");
        }

        if (countBusinessDays(startDate, endDate) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected dates must include at least one working day.");
        }

        if (employee.getManagerEmail() == null || employee.getManagerEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee does not have an assigned manager.");
        }

        String managerEmail = employee.getManagerEmail().trim();

        AnnualLeaveRequest annualLeaveRequest = new AnnualLeaveRequest();
        annualLeaveRequest.setCreationTime(request.getCreationTime());
        annualLeaveRequest.setStartOfLeave(request.getStartOfLeave());
        annualLeaveRequest.setEndOfLeave(request.getEndOfLeave());
        annualLeaveRequest.setReason(request.getReason());
        annualLeaveRequest.setEmployeeEmail(employee.getEmail());
        annualLeaveRequest.updateStatus(STATUS.OPEN);
        annualLeaveRequest.setManagerEmail(managerEmail);
        annualLeaveRequest.setAssignedManager(managerEmail);

        AnnualLeaveRequest saved = leaveRequestRepository.save(annualLeaveRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/annualLeave/{requestId}/approve")
    public AnnualLeaveRequest approveLeaveRequest(
            @PathVariable Long requestId,
            @RequestParam String managerEmail) {
        return updateDecision(requestId, managerEmail, STATUS.ACCEPTED);
    }

    @PutMapping("/annualLeave/{requestId}/reject")
    public AnnualLeaveRequest rejectLeaveRequest(
            @PathVariable Long requestId,
            @RequestParam String managerEmail) {
        return updateDecision(requestId, managerEmail, STATUS.REJECTED);
    }

    @DeleteMapping("/annualLeave/{requestId}")
    public ResponseEntity<Void> cancelLeaveRequest(
            @PathVariable Long requestId,
            @RequestParam String username) {
        Employee requester = resolveEmployee(username, "username");

        AnnualLeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Leave request not found."));

        if (!request.getemployeeEmail().equalsIgnoreCase(requester.getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only cancel your own leave request.");
        }

        if (request.getStatus() != STATUS.OPEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending leave requests can be cancelled.");
        }

        leaveRequestRepository.delete(request);
        return ResponseEntity.noContent().build();
    }

    private AnnualLeaveRequest updateDecision(Long requestId, String managerEmail, STATUS decision) {
        Employee manager = resolveEmployee(managerEmail, "managerEmail");

        Optional<AnnualLeaveRequest> maybeRequest = leaveRequestRepository.findById(requestId);
        if (maybeRequest.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Leave request not found.");
        }

        AnnualLeaveRequest request = maybeRequest.get();
        if (!request.getAssignedManager().equalsIgnoreCase(manager.getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only review requests assigned to you.");
        }

        if (request.getStatus() != STATUS.OPEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This leave request has already been reviewed.");
        }

        if (decision == STATUS.ACCEPTED) {
            int businessDays = countBusinessDays(toLocalDate(request.getStartOfLeave()), toLocalDate(request.getEndOfLeave()));
            Employee employee = resolveEmployee(request.getemployeeEmail(), "employeeEmail");
            employee.setAnnualLeaveBalance(employee.getAnnualLeaveBalance() - businessDays);
            employeeRepository.save(employee);
        }

        request.updateStatus(decision);
        return leaveRequestRepository.save(request);
    }

    private LocalDate toLocalDate(long millis) {
        return Instant.ofEpochMilli(millis).atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private int countBusinessDays(LocalDate startDate, LocalDate endDate) {
        int total = 0;
        LocalDate current = startDate;

        while (!current.isAfter(endDate)) {
            switch (current.getDayOfWeek()) {
                case SATURDAY:
                case SUNDAY:
                    break;
                default:
                    total++;
                    break;
            }
            current = current.plusDays(1);
        }

        return total;
    }

    private String normaliseUsername(String username, String legacyUsername) {
        String resolved = username;
        if (resolved == null || resolved.isBlank()) {
            resolved = legacyUsername;
        }
        if (resolved == null || resolved.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username is required.");
        }
        return resolved.trim();
    }

    private Employee resolveEmployee(String identifier, String fieldName) {
        if (identifier == null || identifier.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required.");
        }

        String normalized = identifier.trim();
        Employee employee = employeeRepository.findByEmail(normalized);
        if (employee == null) {
            employee = employeeRepository.findByUsername(normalized);
        }
        if (employee == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found.");
        }
        return employee;
    }
}
