package com.workgate.fdm.model;

public class Task {

	private int taskId;
	private boolean completion;
	private String description;
	private String title;
	private PRIORITY priority;

	/**
	 * 
	 * @param taskId
	 * @param completion
	 * @param description
	 * @param title
	 * @param priority
	 */
	public Task(int taskId, boolean completion, String description, String title, PRIORITY priority) {
		this.taskId = taskId;
		this.completion = completion;
		this.description = description;
		this.title = title;
		this.priority = priority;
	}

	public int getTaskId() {
		return this.taskId;
	}

	public boolean getCompletion() {
		return this.completion;
	}

	public String getDescription() {
		return this.description;
	}

	public String getTitle() {
		return this.title;
	}

	public PRIORITY getPriority() {
		return this.priority;
	}

}