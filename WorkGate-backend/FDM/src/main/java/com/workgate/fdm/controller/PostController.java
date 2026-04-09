package com.workgate.fdm.controller;
import com.workgate.fdm.model.Post;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {
    @RequestMapping("/pots")
    public List<Post> getPosts(){
        return List.of();
    }


}
