package com.workgate.fdm.model;

import java.util.ArrayList;
import java.util.List;

public class TaskList {

	private List<Task> tasks;

	public TaskList() {
		tasks = new ArrayList<>();
	}

	public List<Task> getTasks() {
		return tasks;
	}

	/**
	 * 
	 * @param title
	 */
	public List<Task> searchByName(String title) {
		// TODO - implement TaskList.searchByName
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param t
	 */
	public boolean addTask(Task t) {
		// TODO - implement TaskList.addTask
		throw new UnsupportedOperationException();
	}

}