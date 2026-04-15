package com.workgate.fdm.DTO;

public class UpdateInfoRequest {
	private String email;
	private String role;
	private String address;
	private String phoneNumber;
	private String emergencyContactNumber;
    private String emergencyContactName;
	private String profilePicture;
	private String name;
    private String surname;

    public UpdateInfoRequest(){}

    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getAddress() { return address; }
    public String getEmergencyContactNumber() { return emergencyContactNumber; }
    public String getName() { return name; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getProfilePicture() { return profilePicture; }
    public String getSurname() { return surname; }
    public String getEmergencyContactName() { return emergencyContactName; }

    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
    public void setAddress(String address) { this.address = address; }
    public void setEmergencyContactNumber(String emergencyContactNumber) { this.emergencyContactNumber = emergencyContactNumber; }
    public void setName(String name) { this.name = name; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public void setSurname(String surname) { this.surname = surname; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }
}
