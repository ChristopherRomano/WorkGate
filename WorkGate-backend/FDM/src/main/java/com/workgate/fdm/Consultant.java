package com.workgate.fdm;

import java.util.ArrayList;
import java.util.List;

public class Consultant extends Employee {

	private String activeClientCode;
	private List<String> keySkills;
	private int endDate;

	public Consultant(String email, String password) {
		super(email, password);
		this.keySkills = new ArrayList<>();
	}

	public boolean updateTimeSheet(int hours) {
		// TODO - implement Consultant.updateTimeSheet
		throw new UnsupportedOperationException();
	}

	public boolean addKeySkill(String skill) {
		return keySkills.add(skill);
	}

	public boolean removeKeySkill(String skill) {
		return keySkills.remove(skill);
	}

	public boolean printInformation() {
		// TODO - implement Consultant.printInformation
		throw new UnsupportedOperationException();
	}

	public void setEndDate(int endDate)       { this.endDate = endDate; }
	public void setClientCode(String code)    { this.activeClientCode = code; }

	public String getActiveClientCode()       { return this.activeClientCode; }
	public List<String> getKeySkills()        { return this.keySkills; }

}
