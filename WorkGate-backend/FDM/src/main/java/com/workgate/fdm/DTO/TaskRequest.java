package com.workgate.fdm.DTO;

import com.workgate.fdm.model.PRIORITY;
import com.workgate.fdm.model.TASK_CATEGORY;

public class TaskRequest {
    private String employeeName;
	private String description;
	private String title;
	private PRIORITY priority;
    private TASK_CATEGORY category;

    public TaskRequest(){}

    public String getEmployeeName() { return employeeName; }
    public String getDescription() { return description; }
    public PRIORITY getPriority() { return priority; }
    public String getTitle() { return title; }
    public TASK_CATEGORY getCategory() { return category; }

    public void setDescription(String description) { this.description = description; }
    public void setPriority(PRIORITY priority) { this.priority = priority; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public void setTitle(String title) { this.title = title; }
    public void setCategory(TASK_CATEGORY category) { this.category = category; }
}
