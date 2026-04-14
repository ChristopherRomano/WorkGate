package com.workgate.fdm.controller;

import com.workgate.fdm.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final Registry registry = Registry.getRegistry();

    /**
     * POST /api/admin/employees
     * Body: { email, username, name, initials, role, tag, managerEmail }
     * Creates a new employee account with an auto-generated temporary password.
     * Returns the created user's details including the temp password for the admin to share.
     */
    @PostMapping("/employees")
    public ResponseEntity<?> createEmployee(@RequestBody Map<String, String> body) {
        String email       = body.get("email");
        String username    = body.get("username");
        String name        = body.get("name");
        String initials    = body.get("initials");
        String role        = body.getOrDefault("role", "employee").toLowerCase();
        String tagStr      = body.get("tag");
        String managerEmail = body.get("managerEmail");

        if (email == null || email.isBlank())    return ResponseEntity.badRequest().body("Email is required.");
        if (username == null || username.isBlank()) return ResponseEntity.badRequest().body("Username is required.");
        if (name == null || name.isBlank())      return ResponseEntity.badRequest().body("Name is required.");

        if (registry.findUserByUsername(username) != null)
            return ResponseEntity.badRequest().body("Username '" + username + "' is already taken.");
        if (registry.findUserByEmail(email) != null)
            return ResponseEntity.badRequest().body("An account with email '" + email + "' already exists.");

        String tempPassword = generateTempPassword();

        Employee emp = switch (role) {
            case "consultant"  -> new Consultant(email, tempPassword);
            case "manager"     -> new Manager(email, tempPassword);
            case "hr"          -> new HrRep(email, tempPassword);
            case "ittech"      -> new ItTechnician(email, tempPassword);
            default            -> new Employee(email, tempPassword);
        };

        emp.setUsername(username);
        emp.setName(name);
        emp.setInitials(initials != null ? initials : deriveInitials(name));
        emp.setAnnualLeaveBalance(25);

        if (tagStr != null) {
            try { emp.setTag(TAG.valueOf(tagStr.toUpperCase())); } catch (IllegalArgumentException ignored) {}
        }

        if (managerEmail != null && !managerEmail.isBlank()) {
            Employee mgr = registry.findEmployeeByEmail(managerEmail);
            if (mgr instanceof Manager) emp.setManager((Manager) mgr);
        }

        registry.addUser(emp);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("id",           emp.getId());
        res.put("name",         emp.getName());
        res.put("initials",     emp.getInitials());
        res.put("email",        emp.getEmail());
        res.put("username",     emp.getUsername());
        res.put("role",         role);
        res.put("tempPassword", tempPassword);
        return ResponseEntity.ok(res);
    }

    /**
     * PUT /api/admin/employees/{email}/deactivate
     * Deactivates an employee account (blocks login, keeps data).
     */
    @PutMapping("/employees/{email:.+}/deactivate")
    public ResponseEntity<?> deactivateEmployee(@PathVariable String email) {
        if (!registry.deactivateUser(email))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("message", "Account deactivated."));
    }

    /**
     * PUT /api/admin/employees/{email}/reactivate
     * Reactivates a previously deactivated account.
     */
    @PutMapping("/employees/{email:.+}/reactivate")
    public ResponseEntity<?> reactivateEmployee(@PathVariable String email) {
        if (!registry.reactivateUser(email))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("message", "Account reactivated."));
    }

    /**
     * DELETE /api/admin/employees/{email}
     * Permanently removes an employee account from the registry.
     */
    @DeleteMapping("/employees/{email:.+}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String email) {
        if (!registry.removeUser(email))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("message", "Account deleted."));
    }

    /**
     * PUT /api/admin/employees/{email}/unlock
     * Clears the failed-attempt lockout on a user account.
     */
    @PutMapping("/employees/{email:.+}/unlock")
    public ResponseEntity<?> unlockEmployee(@PathVariable String email) {
        User user = registry.findUserByEmail(email);
        if (user == null) return ResponseEntity.notFound().build();
        user.unlock();
        return ResponseEntity.ok(Map.of("message", "Account unlocked."));
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        StringBuilder sb = new StringBuilder("Temp#");
        for (int i = 0; i < 5; i++) {
            sb.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return sb.toString();
    }

    private String deriveInitials(String name) {
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) return ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }

}
