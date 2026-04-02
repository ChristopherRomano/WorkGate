package com.workgate.fdm;

import java.util.List;

public class ItTicket extends Request {

	private String title;
	private String description;
	private String category;
	private List<String> evidence;

	/**
	 * 
	 * @param employee
	 * @param creationTIme
	 * @param title
	 * @param description
	 * @param category
	 * @param evidence
	 */
	public ItTicket(Employee employee, int creationTIme, String title, String description, String category, List<String> evidence) {
		// TODO - implement ItTicket.ItTicket
		throw new UnsupportedOperationException();
	}

	public String getTitle() {
		return this.title;
	}

	public String getDescription() {
		return this.description;
	}

	public String getCategory() {
		return this.category;
	}

	public List<String> getEvidence() {
		return this.evidence;
	}

}