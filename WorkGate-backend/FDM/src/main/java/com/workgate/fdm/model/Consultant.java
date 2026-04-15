package com.workgate.fdm.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("CONSULTANT")
public class Consultant extends Employee {

	private String activeClientCode;

	@ElementCollection
	@CollectionTable(name = "consultant_skills", joinColumns = @JoinColumn(name = "consultant_id"))
	@Column(name = "skill")
	private List<String> keySkills = new ArrayList<>();

	private String endDate;

	public Consultant() {
		super();
	}

	public Consultant(String email, String managerEmail, String password, TAG tag) {
		super(email, managerEmail, password, tag);
		this.keySkills = new ArrayList<>();
	}

	public void setActiveClientCode(String code)         { this.activeClientCode = code; }
	public void setEndDate(String endDate)               { this.endDate = endDate; }
	public void setKeySkills(List<String> keySkills)     { this.keySkills = keySkills != null ? keySkills : new ArrayList<>(); }

	public String getActiveClientCode()   { return this.activeClientCode; }
	public String getEndDate()            { return this.endDate; }
	public List<String> getKeySkills()    { return this.keySkills; }

}
