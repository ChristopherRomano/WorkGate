package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.UpdateInfoRequest;
import com.workgate.fdm.model.Consultant;
import org.springframework.web.bind.annotation.*;
import com.workgate.fdm.DTO.NewEmployeeRequest;
import com.workgate.fdm.model.Employee;
import com.workgate.fdm.model.TAG;
import com.workgate.fdm.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
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
    public Employee updateEmployeeInfo(@RequestBody NewEmployeeRequest request) {
        Employee employee = findEmployeeByEmail(request.getEmail());
        if (request.getName() != null)         employee.setName(request.getName());
        if (request.getPassword() != null)     employee.setPassword(request.getPassword());
        if (request.getManagerEmail() != null) employee.setManagerEmail(request.getManagerEmail());
        if (request.getTag() != null)          employee.setTag(request.getTag());
        return employeeRepository.save(employee);
    }

    @GetMapping("/employeeInfo")
    public Employee getEmployeeInfo(@RequestParam String email) {
        return findEmployeeByEmail(email);
    }

    @GetMapping("/profile")
    public Employee getProfile(@RequestParam String email) {
        Employee employee = findEmployeeByEmail(email);
        // Auto-bench deployed consultants whose project end date has passed
        if (employee instanceof Consultant consultant) {
            autoUpdateDeploymentStatus(consultant);
            employeeRepository.save(consultant);
        }
        return employee;
    }

    @PutMapping("/profile")
    public Employee updateProfile(@RequestBody UpdateInfoRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
        }

        Employee employee = employeeRepository.findByEmail(request.getEmail());
        if (employee == null) {
            TAG tag = defaultTagForRole(request.getRole());
            if (isConsultantTag(tag)) {
                Consultant consultant = new Consultant(request.getEmail().trim(), "", "", tag);
                consultant.setActive(true);
                employee = consultant;
            } else {
                employee = new Employee(request.getEmail().trim(), "");
                employee.setTag(tag);
                employee.setActive(true);
            }
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
    public Employee createEmployee(@RequestBody NewEmployeeRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
        }
        if (employeeRepository.findByEmail(request.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee already exists.");
        }

        String managerEmail = validateManagerEmail(request.getManagerEmail(), request.getEmail());
        TAG tag = request.getTag() == null ? TAG.EMPLOYEE : request.getTag();
        String password = request.getPassword() == null ? "pass" : request.getPassword();

        Employee employee;
        if (isConsultantTag(tag)) {
            Consultant consultant = new Consultant(request.getEmail().trim(), managerEmail, password, tag);
            consultant.setActive(true);
            consultant.setName(request.getName());
            consultant.setSurname(request.getSurname());
            if (request.getClientCode() != null && !request.getClientCode().isBlank()) {
                consultant.setActiveClientCode(request.getClientCode().trim());
            }
            employee = consultant;
        } else {
            employee = new Employee(request.getEmail().trim(), password);
            employee.setActive(true);
            employee.setName(request.getName());
            employee.setSurname(request.getSurname());
            employee.setManagerEmail(managerEmail);
            employee.setTag(tag);
        }

        return employeeRepository.save(employee);
    }

    @DeleteMapping("/deleteEmployee")
    public void deleteEmployee(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
        }
        Employee employee = employeeRepository.findByEmail(email);
        if (employee == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found.");
        }
        employeeRepository.delete(employee);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

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
        if (request.getName() != null)                employee.setName(request.getName().trim());
        if (request.getSurname() != null)             employee.setSurname(request.getSurname().trim());
        if (request.getAddress() != null)             employee.setAddress(request.getAddress().trim());
        if (request.getPhoneNumber() != null)         employee.setPhoneNumber(request.getPhoneNumber().trim());
        if (request.getEmergencyContactName() != null)   employee.setEmergencyContact(request.getEmergencyContactName().trim());
        if (request.getEmergencyContactNumber() != null) employee.setEmergencyContactNumber(request.getEmergencyContactNumber().trim());
        if (request.getProfilePicture() != null)      employee.setProfilePicture(request.getProfilePicture().trim());

        // Consultant-only fields
        if (employee instanceof Consultant consultant) {
            if (request.getKeySkills() != null) {
                consultant.setKeySkills(request.getKeySkills());
            }
            if (request.getClientCode() != null) {
                consultant.setActiveClientCode(request.getClientCode().isBlank() ? null : request.getClientCode().trim());
            }
            if (request.getEndDate() != null) {
                String trimmed = request.getEndDate().trim();
                consultant.setEndDate(trimmed.isEmpty() ? null : trimmed);
                autoUpdateDeploymentStatus(consultant);
            }
        }
    }

    /** Sets DEPLOYED if end date is today or in the future, BENCH if it has passed. */
    private void autoUpdateDeploymentStatus(Consultant consultant) {
        String endDate = consultant.getEndDate();
        if (endDate == null || endDate.isBlank()) return;
        TAG tag = consultant.getTag();
        if (tag != TAG.DEPLOYED && tag != TAG.BENCH) return;
        try {
            LocalDate end = LocalDate.parse(endDate);
            consultant.setTag(LocalDate.now().isAfter(end) ? TAG.BENCH : TAG.DEPLOYED);
        } catch (Exception ignored) {}
    }

    private boolean isConsultantTag(TAG tag) {
        return tag == TAG.BENCH || tag == TAG.DEPLOYED || tag == TAG.TRAINEE;
    }

    private TAG defaultTagForRole(String role) {
        if (role == null) return TAG.EMPLOYEE;
        return switch (role.trim().toLowerCase()) {
            case "manager"    -> TAG.MANAGER;
            case "ittech"     -> TAG.IT;
            case "hr"         -> TAG.HR;
            case "admin"      -> TAG.ADMIN;
            case "consultant" -> TAG.BENCH;
            default           -> TAG.EMPLOYEE;
        };
    }

    private String validateManagerEmail(String managerEmail, String employeeEmail) {
        if (managerEmail == null || managerEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Line manager is required.");
        }
        String normalised = managerEmail.trim();
        if (employeeEmail != null && normalised.equalsIgnoreCase(employeeEmail.trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "An employee cannot be their own line manager.");
        }
        Employee manager = employeeRepository.findByEmail(normalised);
        if (manager == null || manager.getTag() != TAG.MANAGER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected line manager is invalid.");
        }
        return manager.getEmail();
    }
}
