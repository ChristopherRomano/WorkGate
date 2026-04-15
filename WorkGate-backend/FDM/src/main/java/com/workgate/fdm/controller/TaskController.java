package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.TaskRequest;
import com.workgate.fdm.model.*;
import com.workgate.fdm.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    // Called from SetTask.jsx (manager assigns to employee)
    @PostMapping("/newTask")
    public ResponseEntity<?> newTask(@RequestBody TaskRequest request) {
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
        task.setId(System.currentTimeMillis());
        task.setEmployeeEmail(request.getEmployeeName());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setCategory(request.getCategory());
        task.setDueDate(request.getDueDate());

        taskRepository.save(task);
        return ResponseEntity.ok("Task created successfully");
    }

    // Called from Tasks.jsx (manager self-assigns or assigns inline)
    @PostMapping("/tasks/assign")
    public ResponseEntity<?> assignTask(@RequestBody TaskRequest request) {
        String email = request.getEmployeeEmail() != null
                ? request.getEmployeeEmail()
                : request.getEmployeeName();

        Task task = new Task();
        task.setId(System.currentTimeMillis());
        task.setEmployeeEmail(email);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setCategory(request.getCategory());
        task.setDueDate(request.getDueDate());

        taskRepository.save(task);
        return ResponseEntity.ok(task);
    }

    // Called from Tasks.jsx on load
    @GetMapping("/tasks/employee/{email}")
    public List<Task> getTasksForEmployee(@PathVariable String email) {
        return taskRepository.findByEmployeeEmail(email);
    }

    // Called from Tasks.jsx mark-complete button
    @PutMapping("/tasks/{id}/complete")
    public ResponseEntity<?> completeTaskById(@PathVariable Long id) {
        Optional<Task> found = taskRepository.findById(id);
        if (found.isEmpty()) return ResponseEntity.notFound().build();
        Task task = found.get();
        task.setCompletion();
        taskRepository.save(task);
        return ResponseEntity.ok("Task completed");
    }

    // Called from Tasks.jsx save-changes (manager edit)
    @PutMapping("/tasks/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        Optional<Task> found = taskRepository.findById(id);
        if (found.isEmpty()) return ResponseEntity.notFound().build();
        Task task = found.get();
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getCategory() != null) task.setCategory(request.getCategory());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        taskRepository.save(task);
        return ResponseEntity.ok("Task updated");
    }

    // Called from Tasks.jsx delete button (manager)
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) return ResponseEntity.notFound().build();
        taskRepository.deleteById(id);
        return ResponseEntity.ok("Task deleted");
    }
}
