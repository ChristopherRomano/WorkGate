package com.workgate.fdm.controller;
import java.util.List;


import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.ExpenseRequestRequest;
import com.workgate.fdm.model.AnnualLeaveRequest;
import com.workgate.fdm.model.ExpenseRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class LeaveRequestController {

    @RequestMapping("/annualLeave")
    public List<AnnualLeaveRequest> getLeaveRequests(@RequestParam String Username){
        //return List.of();
        return List.of(
            new AnnualLeaveRequest("John Doe", 1719855728, 1718473328, 1720633328, "johnsmanager", "cause i wanna")
        );
    }

    @PostMapping("/createAnnualLeave")
    public void createExpenseRequest(@RequestBody ExpenseRequestRequest request){
        System.out.println("Created Annual leave ticket");
    }
}
