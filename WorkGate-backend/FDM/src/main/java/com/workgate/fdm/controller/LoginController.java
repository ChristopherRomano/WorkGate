package com.workgate.fdm.controller;

import java.io.Console;

import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.LoginRequest;
import com.workgate.fdm.model.Employee;
import com.workgate.fdm.repository.EmployeeRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    private final EmployeeRepository employeeRepository;

    public LoginController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("/login")
    public String loginAuthenication(@RequestBody LoginRequest request) {

        try {
            Employee e = employeeRepository.findByEmail(request.getUsername());

            if (e != null && e.checkPassword(request.getPassword())) {

                return "employee"; // or whatever logic you want
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        throw new RuntimeException("Invalid credentials");
    }
}
