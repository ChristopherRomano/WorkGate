package com.workgate.fdm.model;

import jakarta.persistence.Entity;

@Entity
public abstract class ManagerRequest extends Request {

	private String managerEmail;

	public ManagerRequest(String username, long creationTime, String managerEmail) {
		super(username, creationTime);
		this.managerEmail = managerEmail;
	}

	public ManagerRequest (){
		super();
	}

	public String getAssignedManager() {
		return this.managerEmail;
	}

}