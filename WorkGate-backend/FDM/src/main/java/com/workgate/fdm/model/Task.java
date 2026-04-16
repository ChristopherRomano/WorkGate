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
	private TASK_CATEGORY category;
	private String employeeEmail;
	private String dueDate;

    @Id
    private Long id;


	public Task(String description, String title, PRIORITY priority, TASK_CATEGORY category, String employeeEmail) {
		this.title = title;
		this.description = description;
		this.category = category;
		this.priority = priority;
		this.employeeEmail = employeeEmail;
	}

	public Task() {

	}

	public void setCompletion(boolean completion) { this.completion = completion; }
	public void setTitle(String title) { this.title = title; }

	public boolean isCompletion() {
		return completion;
	}

	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setPriority(PRIORITY priority) {
		this.priority = priority;
	}

	public void setCategory(TASK_CATEGORY category) {
		this.category = category;
	}

	public void setEmployeeEmail(String employeeEmail) {
		this.employeeEmail = employeeEmail;
	}

	public String getEmployeeEmail() { return employeeEmail; }
	public int getTaskId() { return this.taskId; }
	public String getDescription() { return this.description; }
	public String getTitle() { return this.title; }
	public PRIORITY getPriority() { return this.priority; }
	public boolean getCompletion() { return this.completion; }
	public void setCompletion() { this.completion = true; }
	public TASK_CATEGORY getCategory() { return category; }
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getDueDate() { return dueDate; }
	public void setDueDate(String dueDate) { this.dueDate = dueDate; }
}