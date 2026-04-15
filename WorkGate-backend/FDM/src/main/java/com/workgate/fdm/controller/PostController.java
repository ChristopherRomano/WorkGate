package com.workgate.fdm.controller;
import com.workgate.fdm.DTO.PostRequest;
import com.workgate.fdm.model.Post;
import com.workgate.fdm.model.TAG;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class PostController {

    @Autowired
    private PostRepository postRepository;

    @RequestMapping("/allPosts")
    public List<Post> getPosts(){
        return postRepository.findAll();
    }

    @RequestMapping("/filterPosts")
    public List<Post> getPosts(@RequestParam TAG tag){

        return postRepository.findAll();
    }


    @PostMapping("/createPost")
    public Post createPost(@RequestBody PostRequest request){
        Post post = new Post(
            request.getTitle(),
            request.getContent(),
            request.getPinned(),
            request.getVisibility(),
            request.getTimePosted(),
            request.getAuthorUsername()
        );
        return postRepository.save(post);
    }

    @DeleteMapping("/posts/{id}")
    public void deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
    }

}
