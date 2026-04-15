package com.workgate.fdm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workgate.fdm.model.EmployeeReport;

import java.util.List;

public interface EmployeeReportRepository extends JpaRepository<EmployeeReport, Long> {
    List<EmployeeReport> findByEmployeeEmail(String employeeEmail);
    EmployeeReport findById(int employeeId);
}