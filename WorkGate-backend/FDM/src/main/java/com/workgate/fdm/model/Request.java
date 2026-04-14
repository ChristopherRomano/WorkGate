package com.workgate.fdm.model;

public abstract class Request {

	private String username;
	private long creationTime;
	private STATUS status;
	private int id;
	
	private static int nextId = 0;

	/**
	 * 
	 * @param status
	 */

	public Request(String username, long creationTime) {
		this.username = username;
		this.creationTime = creationTime;
		this.status = STATUS.OPEN;
		this.id = nextId++;
		
	}
	
	public void updateStatus(STATUS status) {
		this.status = status;
	}

	public String getEmployeeUsername() { return this.username; }
	public long getCreationTime()       { return this.creationTime; }
	public STATUS getStatus()           { return this.status; }
	public int getId()                  { return this.id; }

}