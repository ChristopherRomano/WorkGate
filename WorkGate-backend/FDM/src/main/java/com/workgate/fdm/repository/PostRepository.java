package com.workgate.fdm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workgate.fdm.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    
}