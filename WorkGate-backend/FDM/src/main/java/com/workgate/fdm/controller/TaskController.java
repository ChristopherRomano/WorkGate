package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.TaskRequest;
import com.workgate.fdm.model.*;
import com.workgate.fdm.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    // New endpoint for creating tasks (called from SetTask)
    @PostMapping("/newTask")
    public ResponseEntity<?> newTask(@RequestBody TaskRequest request) {
        // Validation
        if (request.getEmployeeName() == null || request.getEmployeeName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Employee name is required");
        }
        if (request.getTitle() == null || request.getTitle().trim().length() < 3) {
            return ResponseEntity.badRequest().body("Task title must be at least 3 characters");
        }
        if (request.getDescription() == null || request.getDescription().trim().length() < 10) {
            return ResponseEntity.badRequest().body("Task description must be at least 10 characters");
        }

        Task task = new Task();
        task.setEmployeeEmail(request.getEmployeeName());
        task.setDescription(request.getDescription());
        task.setTitle(request.getTitle());
        task.setPriority(request.getPriority());
        task.setCategory(request.getCategory());

        taskRepository.save(task);
        return ResponseEntity.ok("Task created successfully");
    }

    @PostMapping("/tasks/create")
    public void createTask(@RequestBody TaskRequest request) {
        Task task = new Task();

        task.setEmployeeEmail(request.getEmployeeName());
        task.setDescription(request.getDescription());
        task.setTitle(request.getTitle());
        task.setPriority(request.getPriority());
        task.setCategory(request.getCategory());

        taskRepository.save(task);
    }

    @GetMapping("/tasks/view")
    public List<Task> viewTask(@RequestParam String username) {
        return taskRepository.findByEmployeeEmail(username);
    }

    @GetMapping("/tasks/complete")
    public void completeTask(@RequestParam int id) {
        Task task = taskRepository.findById(id);
        task.setCompletion();
        taskRepository.save(task);
    }

}
