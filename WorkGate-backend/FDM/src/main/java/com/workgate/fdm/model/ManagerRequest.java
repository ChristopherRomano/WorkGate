package com.workgate.fdm.model;

public abstract class ManagerRequest extends Request {

	//private Manager assignedManager;
	private String manager;

	public ManagerRequest(String username, long creationTime, String manager) {
		super(username, creationTime);
		this.manager = manager;
	}

	public String getAssignedManager() {
		return this.manager;
	}

}