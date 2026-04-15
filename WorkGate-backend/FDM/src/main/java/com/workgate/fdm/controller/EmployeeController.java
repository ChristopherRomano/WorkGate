package com.workgate.fdm.controller;

import com.workgate.fdm.model.*;
import org.springframework.web.bind.annotation.*;
import com.workgate.fdm.DTO.NewEmployeeRequest;
import com.workgate.fdm.model.Employee;
import com.workgate.fdm.model.TAG;
import com.workgate.fdm.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<Employee> getEmployees() {
        return employeeRepository.findAll();
    }

    @GetMapping("/managers")
    public List<Employee> getManagers() {
        return employeeRepository.findByTag(TAG.MANAGER);
    }

    @PostMapping("/updateEmployee")
    public Employee updateEmployeeInfo(@RequestBody NewEmployeeRequest request){
        Employee employee = findEmployeeByEmail(request.getEmail());

        if (request.getName() != null) {
            employee.setName(request.getName());
        }
        if (request.getPassword() != null) {
            employee.setPassword(request.getPassword());
        }
        if (request.getManagerEmail() != null) {
            employee.setManagerEmail(request.getManagerEmail());
        }
        if (request.getTag() != null) {
            employee.setTag(request.getTag());
        }

        return employeeRepository.save(employee);
    }


    @GetMapping("/employeeInfo")
    public Employee getEmployeeInfo(@RequestParam String email) {
        return findEmployeeByEmail(email);
    }

    @GetMapping("/profile")
    public Employee getProfile(@RequestParam String email) {
        return findEmployeeByEmail(email);
    }

    @PutMapping("/profile")
    public Employee updateProfile(@RequestBody UpdateInfoRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
        }

        Employee employee = employeeRepository.findByEmail(request.getEmail());
        if (employee == null) {
            employee = new Employee(request.getEmail().trim(), "");
            employee.setTag(defaultTagForRole(request.getRole()));
            employee.setActive(true);
        }

        if (employee.getTag() == null) {
            employee.setTag(defaultTagForRole(request.getRole()));
        }

        applyProfileUpdates(employee, request);
        return employeeRepository.save(employee);
    }

    @PutMapping("/{email}/manager")
    public Employee updateEmployeeManager(@PathVariable String email, @RequestBody NewEmployeeRequest request) {
        Employee employee = findEmployeeByEmail(email);
        employee.setManagerEmail(validateManagerEmail(request.getManagerEmail(), employee.getEmail()));
        return employeeRepository.save(employee);
    }

    @PostMapping("/createEmployee")
    public Employee createEmployee (@RequestBody NewEmployeeRequest request){
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
        }

        if (employeeRepository.findByEmail(request.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee already exists.");
        }

        String managerEmail = validateManagerEmail(request.getManagerEmail(), request.getEmail());
        Employee employee = new Employee(request.getEmail().trim(), request.getPassword() == null ? "" : request.getPassword());
        employee.setActive(true);
        employee.setName(request.getName());
        employee.setManagerEmail(managerEmail);
        employee.setTag(request.getTag() == null ? TAG.EMPLOYEE : request.getTag());

        return employeeRepository.save(employee);
    }

    private Employee findEmployeeByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
        }

        Employee employee = employeeRepository.findByEmail(email);
        if (employee == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found.");
        }
        return employee;
    }

    private void applyProfileUpdates(Employee employee, UpdateInfoRequest request) {
        if (request.getName() != null) {
            employee.setName(request.getName().trim());
        }
        if (request.getSurname() != null) {
            employee.setSurname(request.getSurname().trim());
        }
        if (request.getAddress() != null) {
            employee.setAddress(request.getAddress().trim());
        }
        if (request.getPhoneNumber() != null) {
            employee.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getEmergencyContactName() != null) {
            employee.setEmergencyContact(request.getEmergencyContactName().trim());
        }
        if (request.getEmergencyContactNumber() != null) {
            employee.setEmergencyContactNumber(request.getEmergencyContactNumber().trim());
        }
        if (request.getProfilePicture() != null) {
            employee.setProfilePicture(request.getProfilePicture().trim());
        }
    }

    private TAG defaultTagForRole(String role) {
        if (role == null) {
            return TAG.EMPLOYEE;
        }

        return switch (role.trim().toLowerCase()) {
            case "manager" -> TAG.MANAGER;
            case "ittech" -> TAG.IT;
            case "hr" -> TAG.HR;
            case "admin" -> TAG.ADMIN;
            case "consultant" -> TAG.BENCH;
            default -> TAG.EMPLOYEE;
        };
    }

    private String validateManagerEmail(String managerEmail, String employeeEmail) {
        if (managerEmail == null || managerEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Line manager is required.");
        }

        String normalisedManagerEmail = managerEmail.trim();
        if (employeeEmail != null && normalisedManagerEmail.equalsIgnoreCase(employeeEmail.trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "An employee cannot be their own line manager.");
        }

        Employee manager = employeeRepository.findByEmail(normalisedManagerEmail);
        if (manager == null || manager.getTag() != TAG.MANAGER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected line manager is invalid.");
        }

        return manager.getEmail();
    }
}
