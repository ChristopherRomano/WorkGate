package com.workgate.fdm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workgate.fdm.model.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByEmployeeEmail(String employeeEmail);
}