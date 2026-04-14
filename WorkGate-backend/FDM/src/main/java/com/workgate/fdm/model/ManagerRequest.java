package com.workgate.fdm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public abstract class ManagerRequest extends Request {

	@ManyToOne
	private Manager assignedManager;

	public void setAssignedManager(Manager assignedManager) {
		this.assignedManager = assignedManager;
	}

	public Manager getAssignedManager() {
		return this.assignedManager;
	}

}