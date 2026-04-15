package com.workgate.fdm.controller;

import com.workgate.fdm.model.*;
import org.springframework.web.bind.annotation.*;
import com.workgate.fdm.DTO.NewEmployeeRequest;

import org.springframework.beans.factory.annotation.Autowired;
import com.workgate.fdm.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/updateEmployee")
    public void updateEmployeeInfo(@RequestBody NewEmployeeRequest request){
        Employee e = employeeRepository.findByEmail(request.getEmail());

        e.setEmail(request.getEmail());
        e.setName(request.getName());
        e.setPassword(request.getPassword());
        e.setManagerEmail(request.getManagerEmail());
        e.setTag(request.getTag());

        employeeRepository.save(e);
    }


    @GetMapping("/employeeInfo")
    public Employee getEmployeeInfo(@RequestParam String email) {
        try {
            Employee e = employeeRepository.findByEmail(email);

            if (e == null) {
                throw new RuntimeException();
            }
            return e;
        } catch (Exception ex) {
            throw new RuntimeException();
        }
    }

    @PostMapping("/createEmployee")
    public void createEmployee (@RequestBody NewEmployeeRequest request){
        Employee e = new Employee(
            request.getEmail(),
            request.getPassword(),
            request.getManagerEmail(),
            request.getTag()
        );

        employeeRepository.save(e);
    }
}
