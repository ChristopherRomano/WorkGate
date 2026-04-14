package com.workgate.fdm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Task {

	private int taskId;
	private boolean completion;
	private String description;
	private String title;
	private PRIORITY priority;
	private String dueDate;
	private String category;
    @Id
    private Long id;


	public Task(int taskId, boolean completion, String description, String title, PRIORITY priority, String dueDate, String category) {


	}

	public Task() {

	}
	
	public void setCompletion(boolean completion) { this.completion = completion; }
	public void setTitle(String title) { this.title = title; }
	public void setDescription(String description) { this.description = description; }
	public void setDueDate(String dueDate)         { this.dueDate = dueDate; }
	public void setCategory(String category)       { this.category = category; }
	public void setPriority(PRIORITY priority)     { this.priority = priority; }

	public int getTaskId() { return this.taskId; }
	public String getDescription() {return this.description;}
	public String getTitle() { return this.title; }
	public PRIORITY getPriority() { return this.priority; }
	public TASK_CATEGORY getCategory() { return this.category; }
	public boolean getCompletion() { return this.completion; }
}
