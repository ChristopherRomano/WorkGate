package com.workgate.fdm.controller;

import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.LoginRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {
    
    @PostMapping("/login")
    public String loginAuthenication(@RequestBody LoginRequest request){
        final String[] TYPES_OF_USERS = {"employee", "consultant","admin","it","hr","manager"};

        // validate here, return the type of employee
        if (true){

            return TYPES_OF_USERS[0];
        }

        throw new RuntimeException("Invalid credentials");
    }
}
