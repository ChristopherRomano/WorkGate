package com.workgate.fdm.model;

public abstract class ManagerRequest extends Request {

	private Manager assignedManager;

	public Manager getAssignedManager() {
		return this.assignedManager;
	}

}