package com.workgate.fdm.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.EmployeeReportRequest;
import com.workgate.fdm.model.EmployeeReport;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class EmployeeReportController{

    @GetMapping("/employeeReports")
    public List<EmployeeReport> getEmployeeReports(@RequestParam String username) {
        return List.of();
    }

    @PostMapping("/createEmployeeReport")
    public void updateEmployeeInfo(@RequestBody EmployeeReportRequest info){
        System.out.println("Created Employee report ticket");
    }

    @GetMapping("/claimEmployeeReport")
    public void claimEmployeeReport(@RequestParam String username) {
        System.out.println("Claimed Employee report");
    }

}