package com.workgate.fdm.controller;

import com.workgate.fdm.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final Registry registry = Registry.getRegistry();

    /**
     * POST /api/auth/login
     * Body: { username, password }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required.");
        }

        User user = registry.findUserByUsername(username);
        if (user == null || !user.checkPassword(password)) {
            return ResponseEntity.status(401).body("Invalid username or password.");
        }

        return ResponseEntity.ok(buildUserResponse(user));
    }

    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("id",       user.getId());
        res.put("username", user.getUsername());
        res.put("name",     user.getName());
        res.put("initials", user.getInitials());
        res.put("email",    user.getEmail());
        res.put("role",     resolveRole(user));
        res.put("tag",      resolveTag(user));
        return res;
    }

    private String resolveRole(User user) {
        if (user instanceof Manager)       return "manager";
        if (user instanceof HrRep)         return "hr";
        if (user instanceof ItTechnician)  return "ittech";
        if (user instanceof Consultant)    return "consultant";
        if (user instanceof Employee)      return "employee";
        if (user instanceof Administrator) return "admin";
        return "user";
    }

    private String resolveTag(User user) {
        if (user instanceof Employee) {
            TAG tag = ((Employee) user).getTag();
            return tag != null ? tag.name() : null;
        }
        return null;
    }

}
