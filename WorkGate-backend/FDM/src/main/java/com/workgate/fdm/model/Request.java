package com.workgate.fdm.model;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
public abstract class Request {

	private String employeeEmail;
	private long creationTime;
	private STATUS status;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	
	public Request(String employeeEmail, long creationTime) {
		this.employeeEmail = employeeEmail;
		this.creationTime = creationTime;
		this.status = STATUS.OPEN;
		
	}

	public Request(){

	};
	
	public void updateStatus(STATUS status) {
		this.status = status;
	}

	public void setEmployeeEmail(String employeeEmail) {
		this.employeeEmail = employeeEmail;
	}
	public String getemployeeEmail() { return this.employeeEmail; }
	public long getCreationTime()       { return this.creationTime; }
	public long setCreationTime(long creationTime) { return this.creationTime = creationTime; }
	public STATUS getStatus()           { return this.status; }
	public long getId()                  { return this.id; }

}