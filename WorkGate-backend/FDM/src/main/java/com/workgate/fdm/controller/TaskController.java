package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.TaskRequest;
import com.workgate.fdm.model.*;
import com.workgate.fdm.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

     @PostMapping("/create")
     public void createTask(@RequestBody TaskRequest request) {
         Task task = new Task();

         task.setTaskId(request.getTaskId());
         task.setEmployeeEmail(request.getEmployeeName());
         task.setDescription(request.getDescription());
         task.setTitle(request.getTitle());
         task.setPriority(request.getPriority());
         task.setCategory(request.getCategory());

         taskRepository.save(task);
     }

    @GetMapping("/view")
    public List<Task> viewTask(@RequestParam String username) {
        return taskRepository.findByEmployeeEmail(username);
    }

    @GetMapping("/complete")
    public void completeTask(@RequestParam int id) {
        Task task = taskRepository.findById(id);
        task.setCompletion();
        taskRepository.save(task);
    }

}
