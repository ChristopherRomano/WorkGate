package com.workgate.fdm.model;

public abstract class Request {

	private Employee employee;
	private int creationTime;
	private STATUS status;

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