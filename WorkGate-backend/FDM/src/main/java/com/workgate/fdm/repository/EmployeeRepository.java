package com.workgate.fdm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workgate.fdm.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmail(String email);
}