package com.workgate.fdm.repository;

import com.workgate.fdm.model.EmployeeReport;
import com.workgate.fdm.model.ExpenseRequest;
import com.workgate.fdm.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRequestRepository extends JpaRepository<ExpenseRequest, Long> {
    List<ExpenseRequest> findByEmployeeEmail(String employeeEmail);
}