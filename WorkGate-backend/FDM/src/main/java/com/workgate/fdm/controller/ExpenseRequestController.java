package com.workgate.fdm.controller;

import java.util.List;

import com.workgate.fdm.repository.EmployeeRepository;
import com.workgate.fdm.repository.ExpenseRequestRepository;
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

    @GetMapping("/expenses/manager")
    public List<ExpenseRequest> getManagerExpenseRequests(@RequestParam String managerEmail) {
        return expenseRequestRepository.findByManagerEmail(managerEmail);
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

    @RequestMapping("/resolveExpenseRequest")
    public void resolveExpenseRequest(@RequestBody java.util.Map<String, Object> request) {
        Object idValue = request.get("id");
        if (idValue == null) {
            throw new RuntimeException("Expense request id is required");
        }

        Long expenseRequestId = Long.valueOf(String.valueOf(idValue));

        ExpenseRequest expenseRequest = expenseRequestRepository.findById(expenseRequestId)
                .orElseThrow(() -> new RuntimeException("Expense request not found"));

        String rejectionReason = request.get("reason") == null ? "" : String.valueOf(request.get("reason")).trim();

        if (!rejectionReason.isEmpty()) {
            expenseRequest.updateStatus(STATUS.REJECTED);
        } else {
            expenseRequest.updateStatus(STATUS.ACCEPTED);
        }

        expenseRequestRepository.save(expenseRequest);
    }

}
