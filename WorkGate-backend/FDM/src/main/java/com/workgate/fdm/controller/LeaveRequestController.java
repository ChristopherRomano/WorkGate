package com.workgate.fdm.controller;
import java.util.List;


import com.workgate.fdm.DTO.LeaveRequestRequest;
import com.workgate.fdm.repository.EmployeeRepository;
import com.workgate.fdm.repository.ExpenseRequestRepository;
import com.workgate.fdm.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping("/annualLeave")
    public List<AnnualLeaveRequest> getLeaveRequests(@RequestParam String Username){

        return leaveRequestRepository.findByEmployeeEmail(Username);
    }

    @PostMapping("/createAnnualLeave")
    public void createAnnualLeaveRequest(@RequestBody LeaveRequestRequest request) {

        AnnualLeaveRequest annualLeaveRequest = new AnnualLeaveRequest();
        annualLeaveRequest.setCreationTime(request.getCreationTime());
        annualLeaveRequest.setStartOfLeave(request.getStartOfLeave());
        annualLeaveRequest.setEndOfLeave(request.getEndOfLeave());
        annualLeaveRequest.setReason(request.getReason());
        annualLeaveRequest.setEmployeeEmail(request.getUsername());
        annualLeaveRequest.updateStatus(STATUS.OPEN);
        annualLeaveRequest.setManagerEmail(employeeRepository.findByEmail(request.getUsername()).getManagerEmail());

        leaveRequestRepository.save(annualLeaveRequest);
    }
}
