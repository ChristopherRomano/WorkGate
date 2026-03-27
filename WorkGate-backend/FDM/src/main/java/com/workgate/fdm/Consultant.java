package com.workgate.fdm;

public class Consultant extends Employee {

	private String activeClientCode;
	private List<String> keySkills;
	private int endDate;

	/**
	 * 
	 * @param email
	 * @param password
	 */
	public Consultant(String email, String password) {
		// TODO - implement Consultant.Consultant
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param hours
	 */
	public bool updateTimeSheet(int hours) {
		// TODO - implement Consultant.updateTimeSheet
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param skill
	 */
	public bool addKeySkill(String skill) {
		// TODO - implement Consultant.addKeySkill
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param skill
	 */
	public bool removeKeySkill(String skill) {
		// TODO - implement Consultant.removeKeySkill
		throw new UnsupportedOperationException();
	}

	public bool printInformation() {
		// TODO - implement Consultant.printInformation
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param endDate
	 */
	public void setEndDate(int endDate) {
		this.endDate = endDate;
	}

	/**
	 * 
	 * @param clientCode
	 */
	public void setClientCode(String clientCode) {
		// TODO - implement Consultant.setClientCode
		throw new UnsupportedOperationException();
	}

	public String getActiveClientCode() {
		return this.activeClientCode;
	}

}