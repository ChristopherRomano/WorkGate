package com.workgate.fdm.model;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)

public abstract class Request {

	private String username;
	private long creationTime;
	private STATUS status;
	@Id
	private Long id;

	
	public Request(String username, long creationTime) {
		this.username = username;
		this.creationTime = creationTime;
		this.status = STATUS.OPEN;
		
	}

	public Request(){

	};
	
	public void updateStatus(STATUS status) {
		this.status = status;
	}

	public String getEmployeeUsername() { return this.username; }
	public long getCreationTime()       { return this.creationTime; }
	public STATUS getStatus()           { return this.status; }
	public long getId()                  { return this.id; }

}