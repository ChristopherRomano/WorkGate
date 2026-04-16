package com.workgate.fdm.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workgate.fdm.DTO.PostRequest;
import com.workgate.fdm.model.Post;
import com.workgate.fdm.model.TAG;
import com.workgate.fdm.repository.PostRepository;

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