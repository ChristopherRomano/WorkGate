package com.workgate.fdm;

import java.util.List;

public class Manager extends Poster {

	private String teamCode;

	/**
	 * 
	 * @param email
	 * @param password
	 */
	public Manager(String email, String password) {
        super(email, password);
        // TODO - implement Manager.Manager
		throw new UnsupportedOperationException();
	}

	public List<ManagerRequest> getManagerRequest() {
		// TODO - implement Manager.getManagerRequest
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param emp
	 * @param tid
	 * @param completion
	 * @param desc
	 * @param title
	 * @param priority
	 */
	public void assignTask(Employee emp, int tid, boolean completion, String desc, String title, PRIORITY priority) {
		// TODO - implement Manager.assignTask
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param name
	 */
	public Employee searchEmployee(String name) {
		// TODO - implement Manager.searchEmployee
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param e
	 */
	public TaskList getEmployeeTasks(Employee e) {
		// TODO - implement Manager.getEmployeeTasks
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param teamCode
	 */
	public void setTeamCode(String teamCode) {
		this.teamCode = teamCode;
	}

	public float getPendingExpenseTotal() {
		// TODO - implement Manager.getPendingExpenseTotal
		throw new UnsupportedOperationException();
	}

}