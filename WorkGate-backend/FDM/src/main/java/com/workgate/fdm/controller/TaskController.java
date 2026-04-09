package com.workgate.fdm.controller;

import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.DTO.TaskRequest;
import com.workgate.fdm.model.PRIORITY;
import com.workgate.fdm.model.Task;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {
    @GetMapping("/tasks")
    public List<Task> getTasks (){
        return List.of(new Task(0, false, "", "", PRIORITY.LOW));
    }
    @GetMapping("/newTask")
    public boolean newTask (@RequestBody TaskRequest taskRequest){
        return true;
    }
}
