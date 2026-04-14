package com.workgate.fdm.model;

import jakarta.persistence.Entity;

@Entity
public class EmployeeReport extends Request {

	private String content;
	private String title;
	private boolean anonymous;

	/**
	 * 
	 * @param employee
	 * @param creationTime
	 * @param content
	 * @param title
	 * @param privacy
	 */
	public EmployeeReport(Employee employee, int creationTime, String content, String title, boolean privacy) {
		// TODO - implement EmployeeReport.EmployeeReport
		throw new UnsupportedOperationException();
	}

	public EmployeeReport() {

	}

	public String getContent() {
		return this.content;
	}

	public String getTitle() {
		return this.title;
	}

	public boolean getAnonymous() {
		return this.anonymous;
	}

}