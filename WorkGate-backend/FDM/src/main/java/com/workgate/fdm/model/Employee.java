package com.workgate.fdm.model;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue("EMPLOYEE")
public class Employee extends User {

	@Enumerated(EnumType.STRING)
	private TAG tag;
	private String address;
	private String phoneNumber;
	private String emergencyContact;
	private String profilePicture;
	private String managerEmail;
	private int annualLeaveBalance;
	private String surname;
	
	
	public Employee(String email, String managerEmail, String password, TAG tag) {
		super(email, password);
		this.address = "";
		this.phoneNumber = "";
		this.emergencyContact = "";
		this.profilePicture = "";
		this.managerEmail = "";
		this.surname = "";
		this.annualLeaveBalance = 10;
		this.tag = tag;
	}

	public Employee() {

	}

	public void setTag(TAG tag) { this.tag = tag; }
	public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }
	public void setAddress(String address)                  { this.address = address; }
	public void setPhoneNum(String phoneNum)                { this.phoneNumber = phoneNum; }
	public void setEmergencyContact(String contact)         { this.emergencyContact = contact; }
	public void setProfilePic(String image)                 { this.profilePicture = image; }
	public void setAnnualLeaveBalance(int balance)          { this.annualLeaveBalance = balance; }

	public TAG getTag()                     { return this.tag; }
	public int getAnnualLeaveBalance()      { return this.annualLeaveBalance; }
	public String getAddress()              { return this.address; }
	public String getPhoneNumber()          { return this.phoneNumber; }

}