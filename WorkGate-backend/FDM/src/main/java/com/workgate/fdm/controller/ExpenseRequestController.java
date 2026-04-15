package com.workgate.fdm.controller;

import java.util.List;

import com.workgate.fdm.model.EmployeeReport;
import com.workgate.fdm.repository.EmployeeReportRepository;
import com.workgate.fdm.repository.ExpenseRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.ExpenseRequestRequest;
import com.workgate.fdm.model.ExpenseRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class ExpenseRequestController {

    @Autowired
    private ExpenseRequestRepository expenseRequestRepository;

    @RequestMapping("/expenses")
    public List<ExpenseRequest> getExpenseRequests(@RequestParam String username){
        return expenseRequestRepository.findByEmployeeEmail(username);
    }
    @PostMapping("/createExpense")
    public void createExpenseRequest(@RequestBody ExpenseRequestRequest request){
        ExpenseRequest expenseRequest = new ExpenseRequest();
        expenseRequest.setAmount(request.getAmount());
        request.getCurrency();

        return;
    }

    @PostMapping("/expenseRequestApproved")
    public void createExpenseRequest(@RequestBody int id){
        System.out.println("Created Expense ticket");
    }
    
}
