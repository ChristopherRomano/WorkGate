package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.NewEmployeeRequest;
import com.workgate.fdm.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final Registry registry = Registry.getRegistry();

    /**
     * GET /api/employees
     * Returns all Employee accounts (for manager task assignment search).
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getEmployees() {
        List<Map<String, Object>> result = registry.searchUserList().stream()
                .map(this::buildEmployeeResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/employees/{email}
     * Returns a single employee by email.
     */
    @GetMapping("/{email}")
    public ResponseEntity<?> getEmployee(@PathVariable String email) {
        Employee emp = registry.findEmployeeByEmail(email);
        if (emp == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(buildEmployeeResponse(emp));
    }

    private Map<String, Object> buildEmployeeResponse(Employee emp) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",       emp.getId());
        m.put("name",     emp.getName());
        m.put("initials", emp.getInitials());
        m.put("email",    emp.getEmail());
        m.put("role",     resolveRole(emp));
        m.put("tag",      emp.getTag() != null ? emp.getTag().name() : null);
        m.put("manager",  emp.getManager() != null ? emp.getManager().getName() : null);
        return m;
    }

    private String resolveRole(Employee emp) {
        if (emp instanceof Manager)      return "manager";
        if (emp instanceof HrRep)        return "hr";
        if (emp instanceof ItTechnician) return "ittech";
        if (emp instanceof Consultant)   return "consultant";
        return "employee";
    }

    @PostMapping("/createEmployee")
    private void createEmployee (@RequestBody NewEmployeeRequest request){
        
    }

    
}
