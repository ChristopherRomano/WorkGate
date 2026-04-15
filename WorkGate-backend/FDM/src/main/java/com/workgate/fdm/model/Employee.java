package com.workgate.fdm.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("EMPLOYEE")
public class Employee extends User {

	@Enumerated(EnumType.STRING)
	private TAG tag;
	private String address;
	private String phoneNumber;
	private String emergencyContact;
	private String emergencyContactNumber;
	private String profilePicture;
	private String managerEmail;
	private int annualLeaveBalance;
	private String surname;
	
	
	public Employee(String email, String managerEmail, String password, TAG tag) {
		super(email, password);
		this.address = "";
		this.phoneNumber = "";
		this.emergencyContact = "";
		this.emergencyContactNumber = "";
		this.profilePicture = "";
		this.managerEmail = managerEmail;
		this.surname = "";
		this.annualLeaveBalance = 10;
		this.tag = tag;
	}

	public Employee(){
		super();
	}


	public Employee(String email, String password) {
		super(email, password);
		this.address = "";
		this.phoneNumber = "";
		this.emergencyContact = "";
		this.emergencyContactNumber = "";
		this.profilePicture = "";
		this.managerEmail = "";
		this.surname = "";
		this.annualLeaveBalance = 10;
	}


	public void setTag(TAG tag) { this.tag = tag; }
	public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }
	public void setAddress(String address)                  { this.address = address; }
	public void setPhoneNum(String phoneNum)                { this.phoneNumber = phoneNum; }
	public void setPhoneNumber(String phoneNumber)          { this.phoneNumber = phoneNumber; }
	public void setEmergencyContact(String contact)         { this.emergencyContact = contact; }
	public void setEmergencyContactNumber(String contact)   { this.emergencyContactNumber = contact; }
	public void setProfilePic(String image)                 { this.profilePicture = image; }
	public void setProfilePicture(String profilePicture)    { this.profilePicture = profilePicture; }
	public void setAnnualLeaveBalance(int balance)          { this.annualLeaveBalance = balance; }
	public void setSurname(String surname)                  { this.surname = surname; }

	public TAG getTag()                     { return this.tag; }
	public int getAnnualLeaveBalance()      { return this.annualLeaveBalance; }
	public String getAddress()              { return this.address; }
	public String getPhoneNumber()          { return this.phoneNumber; }
	public String getEmergencyContact()     { return this.emergencyContact; }
	public String getEmergencyContactNumber() { return this.emergencyContactNumber; }
	public String getProfilePicture()       { return this.profilePicture; }
	public String getManagerEmail()         { return this.managerEmail; }
	public String getSurname()              { return this.surname; }

}
