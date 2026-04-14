package com.workgate.fdm.model;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)

public abstract class Request {

	@ManyToOne
	@JoinColumn(name = "employee_email")
	private Employee employee;
	private int creationTime;
	private STATUS status;
	@Id
	private Long id;

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	/**
	 * 
	 * @param status
	 */
	public void updateStatus(STATUS status) {
		// TODO - implement Request.updateStatus
		throw new UnsupportedOperationException();
	}

	public Employee getEmployee() {
		return this.employee;
	}

	public int getCreationTime() {
		return this.creationTime;
	}

	public STATUS getStatus() {
		return this.status;
	}

}