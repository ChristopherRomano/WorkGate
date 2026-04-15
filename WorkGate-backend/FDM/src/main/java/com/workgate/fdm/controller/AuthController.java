package com.workgate.fdm.controller;

import com.workgate.fdm.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required.");
        }

        // Demo logic (replace with DB later)
        if (!password.equals("pass")) {
            return ResponseEntity.status(401).body("Invalid username or password.");
        }


        Map<String, Object> response = new LinkedHashMap<>();
        response.put("username", username);
        response.put("role", "admin");

        return ResponseEntity.ok(response);
    }
}
