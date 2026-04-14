package com.workgate.fdm.model;

import java.util.Locale.Category;

public class Task {

	private int taskId;
	private boolean completion;
	private String description;
	private String title;
	private PRIORITY priority;
	private TASK_CATEGORY category;

	public Task(int taskId, boolean completion, String description, String title, PRIORITY priority,TASK_CATEGORY category) {
		this.taskId = taskId;
		this.completion = completion;
		this.description = description;
		this.title = title;
		this.priority = priority;
		this.category = category;
	}
	
	public void setCompletion(boolean completion) { this.completion = completion; }
	public void setTitle(String title) { this.title = title; }
	public void setDescription(String description) { this.description = description; }
	public void setCategory(TASK_CATEGORY category) { this.category = category; }
	public void setPriority(PRIORITY priority) { this.priority = priority; }

	public int getTaskId() { return this.taskId; }
	public String getDescription() {return this.description;}
	public String getTitle() { return this.title; }
	public PRIORITY getPriority() { return this.priority; }
	public TASK_CATEGORY getCategory() { return this.category; }
	public boolean getCompletion() { return this.completion; }
}
