package com.workgate.fdm.controller;

<<<<<<< HEAD
import com.workgate.fdm.DTO.NewEmployeeRequest;
=======
import com.workgate.fdm.DTO.EmployeeReportRequest;
>>>>>>> b39e9318dbdb935f5e53ce2992273ab28ff2223c
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

    @PostMapping("/createEmployee")
    private void createEmployee (@RequestBody NewEmployeeRequest request){
        
    }

    
}
