package com.workgate.fdm.model;

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

	public boolean addKeySkill(String skill) { return keySkills.add(skill); }

	public boolean removeKeySkill(String skill) { return keySkills.remove(skill); }

	public void setEndDate(int endDate) { this.endDate = endDate; }
	public void setClientCode(String code) { this.activeClientCode = code; }

	public String getActiveClientCode() { return this.activeClientCode; }
	public List<String> getKeySkills() { return this.keySkills; }
	public int getEndDate() { return endDate; }

}
