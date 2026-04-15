package com.workgate.fdm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workgate.fdm.model.Request;

public interface RequestRepository extends JpaRepository<Request, Long> {
    
}