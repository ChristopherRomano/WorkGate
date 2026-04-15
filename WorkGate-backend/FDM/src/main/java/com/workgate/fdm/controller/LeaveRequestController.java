package com.workgate.fdm.controller;
import java.util.List;


import com.workgate.fdm.DTO.LeaveRequestRequest;
import com.workgate.fdm.model.CURRENCY;
import com.workgate.fdm.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.ExpenseRequestRequest;
import com.workgate.fdm.model.AnnualLeaveRequest;
import com.workgate.fdm.model.ExpenseRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class LeaveRequestController {

    @Autowired
    LeaveRequestRepository leaveRequestRepository;
    @RequestMapping("/annualLeave")
    public List<AnnualLeaveRequest> getLeaveRequests(@RequestParam String Username){

        return leaveRequestRepository.findByEmployeeEmail(Username);
    }

    @PostMapping("/createAnnualLeave")
    public void createAnnualLeaveRequest(@RequestBody LeaveRequestRequest request) {

        AnnualLeaveRequest annualLeaveRequest = new AnnualLeaveRequest();
        annualLeaveRequest.setStartOfLeave(request.getStartOfLeave());
        annualLeaveRequest.setEndOfLeave(request.getEndOfLeave());
        annualLeaveRequest.setReason(request.getReason());

        leaveRequestRepository.save(annualLeaveRequest);
    }
}
