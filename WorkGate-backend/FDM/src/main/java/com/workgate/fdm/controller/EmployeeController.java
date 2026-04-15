package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.EmployeeReportRequest;
import com.workgate.fdm.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.workgate.fdm.DTO.LoginRequest;
import com.workgate.fdm.DTO.NewEmployeeRequest;
import com.workgate.fdm.DTO.UpdateInfoRequest;

import org.springframework.beans.factory.annotation.Autowired;
import com.workgate.fdm.repository.EmployeeRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/updateEmployee")
    public void createEmployeeInfo(@RequestBody EmployeeReportRequest info){
        System.out.println("Created Employee report ticket");
    }


    @GetMapping("/employeeInfo")
    public Employee getEmployeeInfo(@RequestParam String username) {

        return new Employee("fdsfs", "fdsdfs", "password", TAG.ADMIN);
    }

    @PostMapping("/createEmployee")
    public void createEmployee (@RequestBody NewEmployeeRequest request){
        System.out.println("CHris sucks");
        Employee e = new Employee(
            request.getEmail(),
            request.getManagerEmail(),
            request.getPassword(),
            request.getTag()
        );

        employeeRepository.save(e);
    }
}
