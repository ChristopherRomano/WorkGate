package com.workgate.fdm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workgate.fdm.model.Employee;
import com.workgate.fdm.model.TAG;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmail(String email);
    Employee findByUsername(String username);
    List<Employee> findByTag(TAG tag);
}
