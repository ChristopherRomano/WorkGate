package com.workgate.fdm.model;

import jakarta.persistence.Entity;

@Entity
public class AnnualLeaveRequest extends ManagerRequest {

	private long startOfLeave;
	private long endOfLeave;
	private String reason;
	private String username;
	private long creationTime;
	private String assignedManager;

	public AnnualLeaveRequest(String username, long startOfleave, long creationTime, long endOfLeave, String assignedManger, String reason) {
		super(username, creationTime, assignedManger);
		this.startOfLeave = startOfleave;
		this.endOfLeave = endOfLeave;
		this.reason = reason;
		this.username = username;
		this.creationTime = creationTime;
		this.assignedManager = assignedManger;
	}

	public String getusername() {
		return this.username;
	}

	public long getStartOfLeave() {
		return this.startOfLeave;
	}

	public long getEndOfLeave() {
		return this.endOfLeave;
	}

	public long getCreationTime() {
		return this.creationTime;
	}

	public String getAssignedManager() {
		return this.assignedManager;
	}

	public String getReason() {
		return this.reason;
	}
}