package com.workgate.fdm.controller;

import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.TaskRequest;
import com.workgate.fdm.model.PRIORITY;
import com.workgate.fdm.model.Task;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class TaskController {
    @GetMapping("/tasks")
    public List<Task> getTasks (@RequestParam String username){
        return List.of(new Task(0, false, "", "", PRIORITY.LOW));
    }
    @PostMapping("/newTask")
    public void newTask (@RequestBody TaskRequest taskRequest){
        System.out.println("Task Created");
    }
    @GetMapping("/completeTask")
    public void completedTask (@RequestBody String username){
        System.out.println("Task completed");
    }
}
