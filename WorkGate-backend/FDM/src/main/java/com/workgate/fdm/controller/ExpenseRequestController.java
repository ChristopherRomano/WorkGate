package com.workgate.fdm.controller;

import java.util.List;

import com.workgate.fdm.repository.EmployeeRepository;
import com.workgate.fdm.repository.ExpenseRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.ExpenseRequestRequest;
import com.workgate.fdm.model.ExpenseRequest;
import com.workgate.fdm.model.STATUS;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class ExpenseRequestController {

    private final ExpenseRequestRepository expenseRequestRepository;
    private final EmployeeRepository employeeRepository;

    public ExpenseRequestController(
            ExpenseRequestRepository expenseRequestRepository,
            EmployeeRepository employeeRepository) {
        this.expenseRequestRepository = expenseRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    @RequestMapping("/expenses")
    public List<ExpenseRequest> getExpenseRequests(@RequestParam String username) {
        return expenseRequestRepository.findByEmployeeEmail(username);
    }

    @PostMapping("/createExpense")
    public void createExpenseRequest(@RequestBody ExpenseRequestRequest request) {
        ExpenseRequest expenseRequest = new ExpenseRequest();
        expenseRequest.setAmount(request.getAmount());
        expenseRequest.setCurrency(request.getCurrency());
        expenseRequest.setEvidence(request.getEvidence());
        expenseRequest.setCreationTime(request.getPurchaseDate());
        expenseRequest.setEmployeeEmail(request.getUsername());
        expenseRequest.setReason(request.getReason());
        expenseRequest.updateStatus(STATUS.OPEN);
        expenseRequest.setManagerEmail(employeeRepository.findByEmail(request.getUsername()).getManagerEmail());


        expenseRequestRepository.save(expenseRequest);
    }

}
