package com.workgate.fdm.controller;
import com.workgate.fdm.DTO.TimesheetRequest;
import com.workgate.fdm.model.Post;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TimeSheetController {
    @RequestMapping("/timesheets")
    public List<Post> getTimesheet(@RequestParam String username){
        return List.of();
    }

    @PostMapping("/createTimesheet")
    public void createPost(@RequestBody TimesheetRequest request){
        System.out.println("Timesheet updated");
    }

}