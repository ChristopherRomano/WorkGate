package com.workgate.fdm.model;

import jakarta.persistence.Entity;

@Entity
public class EmployeeReport extends Request {

	private String content;
	private String title;
	private boolean anonymous;

	public EmployeeReport(String username, long creationTime, String content, String title, boolean privacy) {
		super(username, creationTime);
		this.title = title;
		this.anonymous = privacy;
		this.content = content;

	}

	public String getContent() { return this.content; }
	public String getTitle() { return this.title; }
	public boolean getAnonymous() { return this.anonymous; }
}