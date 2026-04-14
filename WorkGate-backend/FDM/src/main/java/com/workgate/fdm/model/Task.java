package com.workgate.fdm.model;

public class Task {

	private int taskId;
	private boolean completion;
	private String description;
	private String title;
	private PRIORITY priority;
	private String dueDate;
	private String category;

	public Task(int taskId, boolean completion, String description, String title, PRIORITY priority) {
		this.taskId = taskId;
		this.completion = completion;
		this.description = description;
		this.title = title;
		this.priority = priority;
	}

	public Task(int taskId, boolean completion, String description, String title, PRIORITY priority, String dueDate, String category) {
		this(taskId, completion, description, title, priority);
		this.dueDate = dueDate;
		this.category = category;
	}

	public int getTaskId() {
		return this.taskId;
	}

	public boolean getCompletion() {
		return this.completion;
	}

	public void setCompletion(boolean completion) { this.completion = completion; }
	public void setTitle(String title)             { this.title = title; }
	public void setDescription(String description) { this.description = description; }
	public void setDueDate(String dueDate)         { this.dueDate = dueDate; }
	public void setCategory(String category)       { this.category = category; }
	public void setPriority(PRIORITY priority)     { this.priority = priority; }

	public String getDescription() {
		return this.description;
	}

	public String getTitle() {
		return this.title;
	}

	public PRIORITY getPriority() {
		return this.priority;
	}

	public String getDueDate() {
		return this.dueDate;
	}

	public String getCategory() {
		return this.category;
	}

}
