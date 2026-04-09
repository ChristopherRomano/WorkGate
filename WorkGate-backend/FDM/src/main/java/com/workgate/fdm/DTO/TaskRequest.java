package com.workgate.fdm.DTO;

import com.workgate.fdm.model.PRIORITY;

public class TaskRequest {
    private int taskId;
	private boolean completion;
	private String description;
	private String title;
	private PRIORITY priority;

    public int getTaskId() {
        return taskId;
    }
    public boolean getCompletion(){
        return completion;
    }
    public String getDescription() {
        return description;
    }
    public PRIORITY getPriority() {
        return priority;
    }
    public String getTitle() {
        return title;
    }
    public void setCompletion(boolean completion) {
        this.completion = completion;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setPriority(PRIORITY priority) {
        this.priority = priority;
    }
    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }
    public void setTitle(String title) {
        this.title = title;
    }
}
