package com.workgate.fdm.controller;

import com.workgate.fdm.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final Registry registry = Registry.getRegistry();

    /**
     * POST /api/tasks/assign
     * Body: { managerEmail, employeeEmail, title, description, priority, dueDate, category }
     */
    @PostMapping("/assign")
    public ResponseEntity<?> assignTask(@RequestBody Map<String, String> body) {
        String managerEmail = body.get("managerEmail");
        String employeeEmail = body.get("employeeEmail");

        Employee manager = registry.findEmployeeByEmail(managerEmail);
        if (!(manager instanceof Manager)) {
            return ResponseEntity.badRequest().body("Manager not found: " + managerEmail);
        }

        Employee employee = registry.findEmployeeByEmail(employeeEmail);
        if (employee == null) {
            return ResponseEntity.badRequest().body("Employee not found: " + employeeEmail);
        }

        String title = body.get("title");
        String description = body.get("description");
        String dueDate = body.get("dueDate");
        String category = body.get("category");

        PRIORITY priority;
        try {
            priority = PRIORITY.valueOf(body.getOrDefault("priority", "MEDIUM").toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid priority. Use LOW, MEDIUM, or HIGH.");
        }

        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().body("Title is required.");
        }

        int taskId = registry.nextTaskId();
        ((Manager) manager).assignTask(employee, taskId, false, description, title, priority, dueDate, category);

        return ResponseEntity.ok(Map.of(
                "message", "Task assigned successfully.",
                "taskId", taskId,
                "assignedTo", employee.getName() != null ? employee.getName() : employeeEmail
        ));
    }

    /**
     * GET /api/tasks/employee/{email}
     * Returns all tasks assigned to the employee with the given email.
     */
    @GetMapping("/employee/{email}")
    public ResponseEntity<?> getEmployeeTasks(@PathVariable String email) {
        Employee employee = registry.findEmployeeByEmail(email);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }
        List<Task> tasks = employee.viewTasks();
        return ResponseEntity.ok(tasks);
    }

    /**
     * PUT /api/tasks/{taskId}/complete
     * Body: { employeeEmail }
     * Marks the task as complete for the given employee.
     */
    @PutMapping("/{taskId}/complete")
    public ResponseEntity<?> completeTask(@PathVariable int taskId, @RequestBody Map<String, String> body) {
        String employeeEmail = body.get("employeeEmail");
        Employee employee = registry.findEmployeeByEmail(employeeEmail);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }

        Task task = employee.getTaskList().getById(taskId);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        employee.completeTask(task);
        return ResponseEntity.ok(Map.of("message", "Task marked as complete.", "taskId", taskId));
    }

    /**
     * PUT /api/tasks/{taskId}
     * Body: { employeeEmail, title, description, priority, dueDate, category }
     * Updates an existing task's fields.
     */
    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable int taskId, @RequestBody Map<String, String> body) {
        String employeeEmail = body.get("employeeEmail");
        Employee employee = registry.findEmployeeByEmail(employeeEmail);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }

        Task task = employee.getTaskList().getById(taskId);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        if (body.containsKey("title") && !body.get("title").isBlank()) {
            task.setTitle(body.get("title"));
        }
        if (body.containsKey("description")) {
            task.setDescription(body.get("description"));
        }
        if (body.containsKey("dueDate")) {
            task.setDueDate(body.get("dueDate"));
        }
        if (body.containsKey("category")) {
            task.setCategory(body.get("category"));
        }
        if (body.containsKey("priority")) {
            try {
                task.setPriority(PRIORITY.valueOf(body.get("priority").toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        return ResponseEntity.ok(Map.of("message", "Task updated.", "taskId", taskId));
    }

    /**
     * DELETE /api/tasks/{taskId}
     * Body: { employeeEmail }
     * Removes the task from the employee's task list.
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable int taskId, @RequestBody Map<String, String> body) {
        String employeeEmail = body.get("employeeEmail");
        Employee employee = registry.findEmployeeByEmail(employeeEmail);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }

        boolean removed = employee.getTaskList().removeTask(taskId);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of("message", "Task deleted.", "taskId", taskId));
    }

}
