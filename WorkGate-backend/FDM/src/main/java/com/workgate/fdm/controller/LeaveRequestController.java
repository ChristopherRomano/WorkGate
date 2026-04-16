package com.workgate.fdm.controller;

import java.util.List;


import com.workgate.fdm.DTO.LeaveRequestRequest;
import com.workgate.fdm.model.Employee;
import com.workgate.fdm.repository.EmployeeRepository;
import com.workgate.fdm.repository.LeaveRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.workgate.fdm.model.AnnualLeaveRequest;
import com.workgate.fdm.model.STATUS;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

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
    public List<AnnualLeaveRequest> getLeaveRequests(@RequestParam String username){
        return leaveRequestRepository.findByEmployeeEmail(username);
    }

    @GetMapping("/annualLeave/manager")
    public List<AnnualLeaveRequest> getManagerLeaveRequests(@RequestParam String managerEmail) {
        return leaveRequestRepository.findByManagerEmail(managerEmail);
    }

    @PostMapping("/createAnnualLeave")
    public void createAnnualLeaveRequest(@RequestBody LeaveRequestRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }

        if (request.getEndOfLeave() < request.getStartOfLeave()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Leave end date cannot be before start date");
        }

        Employee employee = employeeRepository.findByEmail(request.getUsername());
        if (employee == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
        }

        int requestedDays = calculateRequestedDays(request.getStartOfLeave(), request.getEndOfLeave());
        if (requestedDays > employee.getAnnualLeaveBalance()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested leave exceeds annual leave balance");
        }

        AnnualLeaveRequest annualLeaveRequest = new AnnualLeaveRequest();
        annualLeaveRequest.setCreationTime(request.getCreationTime());
        annualLeaveRequest.setStartOfLeave(request.getStartOfLeave());
        annualLeaveRequest.setEndOfLeave(request.getEndOfLeave());
        annualLeaveRequest.setReason(request.getReason());
        annualLeaveRequest.setEmployeeEmail(request.getUsername());
        annualLeaveRequest.updateStatus(STATUS.OPEN);
        annualLeaveRequest.setManagerEmail(employee.getManagerEmail());

        leaveRequestRepository.save(annualLeaveRequest);
    }

    @PostMapping("/resolveAnnualLeaveRequest")
    public void resolveAnnualLeaveRequest(@RequestBody java.util.Map<String, Object> request) {
        Object idValue = request.get("id");
        if (idValue == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Leave request id is required");
        }

        Long leaveRequestId = Long.valueOf(String.valueOf(idValue));

        AnnualLeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Leave request not found"));

        String rejectionReason = request.get("reason") == null ? "" : String.valueOf(request.get("reason")).trim();

        if (!rejectionReason.isEmpty()) {
            leaveRequest.updateStatus(STATUS.REJECTED);
            leaveRequest.setRejectionReason(rejectionReason);
            leaveRequestRepository.save(leaveRequest);
            return;
        }

        Employee employee = employeeRepository.findByEmail(leaveRequest.getemployeeEmail());
        if (employee == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found for leave request");
        }

        int requestedDays = calculateRequestedDays(leaveRequest.getStartOfLeave(), leaveRequest.getEndOfLeave());
        if (requestedDays > employee.getAnnualLeaveBalance()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee has insufficient leave balance");
        }

        employee.setAnnualLeaveBalance(employee.getAnnualLeaveBalance() - requestedDays);
        employeeRepository.save(employee);

        leaveRequest.updateStatus(STATUS.ACCEPTED);
        leaveRequestRepository.save(leaveRequest);
    }

    @DeleteMapping("/annualLeave/{id}")
    public void cancelLeaveRequest(@PathVariable Long id, @RequestParam String username) {
        AnnualLeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Leave request not found"));

        if (!leaveRequest.getemployeeEmail().equalsIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only cancel your own leave requests");
        }

        if (leaveRequest.getStatus() != STATUS.OPEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending leave requests can be cancelled");
        }

        leaveRequestRepository.delete(leaveRequest);
    }

    private int calculateRequestedDays(long startMillis, long endMillis) {
        LocalDate startDate = Instant.ofEpochMilli(startMillis).atZone(ZoneOffset.UTC).toLocalDate();
        LocalDate endDate = Instant.ofEpochMilli(endMillis).atZone(ZoneOffset.UTC).toLocalDate();
        int count = 0;
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            DayOfWeek dow = current.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
                count++;
            }
            current = current.plusDays(1);
        }
        return Math.max(1, count);
    }
}
