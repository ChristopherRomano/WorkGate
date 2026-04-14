package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.EmployeeReportRequest;
import com.workgate.fdm.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.workgate.fdm.DTO.LoginRequest;
import com.workgate.fdm.DTO.UpdateInfoRequest;
import com.workgate.fdm.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import com.workgate.fdm.repository.EmployeeRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository repository;

    @PostMapping("/createEmployee")
    public void createEmployeeInfo(@RequestBody EmployeeReportRequest info){
        System.out.println("Created Employee report ticket");
    }


    @GetMapping("/employeeInfo")
    public Employee getEmployeeInfo(@RequestParam String username) {

        return new Employee("fdsfs", "fdsdfs");
    }

}
