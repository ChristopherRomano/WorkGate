package com.workgate.fdm.controller;

import org.springframework.web.bind.annotation.*;
import com.workgate.fdm.model.Employee;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController{

    @GetMapping("/employeeInfo")
    public Employee getEmployeeInfo(@RequestParam String username) {

        return new Employee("testFdm@fdm.com", "password");
    }
}