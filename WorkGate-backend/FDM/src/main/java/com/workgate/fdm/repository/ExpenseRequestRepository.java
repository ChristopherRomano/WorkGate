package com.workgate.fdm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workgate.fdm.model.ExpenseRequest;

public interface ExpenseRequestRepository extends JpaRepository<ExpenseRequest, Long> {
    List<ExpenseRequest> findByEmployeeEmail(String employeeEmail);
    List<ExpenseRequest> findByManagerEmail(String managerEmail);
    ExpenseRequest findById(long Id);
}
