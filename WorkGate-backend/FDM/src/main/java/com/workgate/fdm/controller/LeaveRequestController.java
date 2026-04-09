package com.workgate.fdm.controller;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.model.ExpenseRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class LeaveRequestController {
    @RequestMapping("/annualLeave")
    public List<ExpenseRequest> getExpenseRequests(@RequestParam String Username){
        return List.of();
    }
}
