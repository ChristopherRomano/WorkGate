package com.workgate.fdm.controller;

import java.util.List;

import com.workgate.fdm.repository.EmployeeReportRepository;
import com.workgate.fdm.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.ClaimRequest;
import com.workgate.fdm.DTO.EmployeeReportRequest;
import com.workgate.fdm.model.EmployeeReport;
import com.workgate.fdm.model.STATUS;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class EmployeeReportController{

    @Autowired
    private EmployeeReportRepository employeeReportRepository;

    @GetMapping("/employeeReports")
    public List<EmployeeReport> getEmployeeReports(@RequestParam String username) {
        return employeeReportRepository.findByEmployeeEmail(username);

    }

    @PostMapping("/createEmployeeReport")
    public void createEmployeeReport(@RequestBody EmployeeReportRequest info){

        EmployeeReport employeeReport = new EmployeeReport();
        employeeReport.setContent(info.getContent());
        employeeReport.setAnonymous(info.getIsAnonymous());
        employeeReport.setTitle(info.getTitle());
        employeeReport.setCreationTime(info.getCreationTime());
        employeeReport.setEmployeeEmail(info.getUsername());
        employeeReport.updateStatus(STATUS.OPEN);
        employeeReportRepository.save(employeeReport);
    }

    @RequestMapping("/claimEmployeeReport")
    public void claimEmployeeReport(@RequestBody ClaimRequest request) {
        EmployeeReport report = employeeReportRepository.findById(request.getId())
            .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setEmployeeEmail(request.getEmail());

        report.updateStatus(STATUS.IN_PROGRESS);

        employeeReportRepository.save(report);
    }

    @RequestMapping("/resolveEmployeeReport")
    public void resolveEmployeeReport(@RequestBody Long id) {
        EmployeeReport report = employeeReportRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Report not found"));

        report.updateStatus(STATUS.RESOLVED);

        employeeReportRepository.save(report);
    }

}