package com.workgate.fdm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class TaskList {

	@OneToMany
	private List<Task> tasks;
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	public TaskList() {
		this.tasks = new ArrayList<>();
	}

	public boolean addTask(Task t) {
		return tasks.add(t);
	}

	public boolean removeTask(int taskId) {
		return tasks.removeIf(t -> t.getTaskId() == taskId);
	}

	public Task getById(int taskId) {
		return tasks.stream()
				.filter(t -> t.getTaskId() == taskId)
				.findFirst()
				.orElse(null);
	}

	public List<Task> getTasks() {
		return this.tasks;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}
}
