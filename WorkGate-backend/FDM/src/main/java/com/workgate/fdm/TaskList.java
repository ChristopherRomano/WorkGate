package com.workgate.fdm;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class TaskList {

	private List<Task> tasks;

	public TaskList() {
		this.tasks = new ArrayList<>();
	}

	public List<Task> searchByName(String title) {
		return tasks.stream()
				.filter(t -> t.getTitle().toLowerCase().contains(title.toLowerCase()))
				.collect(Collectors.toList());
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

}
