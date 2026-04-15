package com.workgate.fdm.model;

import jakarta.persistence.*;
import java.util.concurrent.ThreadLocalRandom;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
public abstract class Request {

	private String employeeEmail;
	private long creationTime;
	private STATUS status;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@PrePersist
	private void ensureIdForSqlite() {
		if (this.id == null) {
			long candidate = System.currentTimeMillis() * 1000L + ThreadLocalRandom.current().nextInt(1000);
			if (candidate < 0) {
				candidate = Math.abs(candidate);
			}
			this.id = candidate;
		}
	}

	
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