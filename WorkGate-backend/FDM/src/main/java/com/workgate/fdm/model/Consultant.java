package com.workgate.fdm.model;

import java.util.List;

public class Consultant extends Employee {

	private String activeClientCode;
	private List<String> keySkills;
	private int endDate;

	public Consultant(String email, String password) {
        super(email, password);
        // TODO - implement Consultant.Consultant
		throw new UnsupportedOperationException();
	}

	public boolean updateTimeSheet(int hours) {
		// TODO - implement Consultant.updateTimeSheet
		throw new UnsupportedOperationException();
	}

	public void addKeySkill(String skill) {
		this.keySkills.add(skill);
	}

	public void removeKeySkill(String skill) {
		this.keySkills.remove(skill);
	}

	public boolean printInformation() {
		// TODO - implement Consultant.printInformation
		throw new UnsupportedOperationException();
	}

	
	public void setEndDate(int endDate) {
		this.endDate = endDate;
	}
	
	public void setClientCode(String clientCode) {
		this.activeClientCode = clientCode;
	}

	public String getActiveClientCode() {
		return this.activeClientCode;
	}

	public int getEndDate (){
		return endDate;
	}

}