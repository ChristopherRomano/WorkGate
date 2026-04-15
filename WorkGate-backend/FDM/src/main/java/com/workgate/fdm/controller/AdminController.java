package com.workgate.fdm.controller;

import com.workgate.fdm.model.Employee;
import com.workgate.fdm.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PutMapping("/{email}/deactivate")
    public Employee deactivateEmployee(@PathVariable String email) {
        Employee employee = findByEmail(email);
        employee.setActive(false);
        return employeeRepository.save(employee);
    }

    @PutMapping("/{email}/reactivate")
    public Employee reactivateEmployee(@PathVariable String email) {
        Employee employee = findByEmail(email);
        employee.setActive(true);
        return employeeRepository.save(employee);
    }

    @DeleteMapping("/{email}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable String email) {
        Employee employee = findByEmail(email);
        employeeRepository.delete(employee);
    }

    @PutMapping("/{email}/unlock")
    public Employee unlockEmployee(@PathVariable String email) {
        Employee employee = findByEmail(email);
        employee.unlock();
        return employeeRepository.save(employee);
    }

    private Employee findByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
        }
        Employee employee = employeeRepository.findByEmail(email);
        if (employee == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found.");
        }
        return employee;
    }
}
