package com.workgate.fdm.controller;

import java.io.Console;

import com.workgate.fdm.DTO.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.LoginRequest;
import com.workgate.fdm.model.Employee;
import com.workgate.fdm.repository.EmployeeRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public LoginResponse loginAuthenication(@RequestBody LoginRequest request) {

        try {
            Employee e = employeeRepository.findByEmail(request.getUsername());

            if (e != null && e.checkPassword(request.getPassword())) {
                LoginResponse response = new LoginResponse();
                response.setUsername(request.getUsername());
                response.setTag(e.getTag());
                return response;
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        throw new RuntimeException("Invalid credentials");
    }
}
