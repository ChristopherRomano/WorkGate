package com.workgate.fdm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workgate.fdm.model.EmployeeReport;

public interface EmployeeReportRepository extends JpaRepository<EmployeeReport, Long> {
    
}