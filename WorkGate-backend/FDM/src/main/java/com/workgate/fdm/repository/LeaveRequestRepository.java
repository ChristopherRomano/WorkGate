package com.workgate.fdm.repository;

import com.workgate.fdm.model.AnnualLeaveRequest;
import com.workgate.fdm.model.ExpenseRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<AnnualLeaveRequest, Long> {
    List<AnnualLeaveRequest> findByEmployeeEmail(String employeeEmail);
}