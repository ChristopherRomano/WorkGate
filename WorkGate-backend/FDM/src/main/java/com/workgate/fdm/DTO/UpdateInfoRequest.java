package com.workgate.fdm.DTO;

public class UpdateInfoRequest {
	private String address;
	private String phoneNumber;
	private String emergencyContact;
	private String profilePicture;
	private String name;

    public UpdateInfoRequest(){}

    public String getAddress() { return address; }
    public String getEmergencyContact() { return emergencyContact; }
    public String getName() { return name; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getProfilePicture() { return profilePicture; }

    public void setAddress(String address) { this.address = address; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public void setName(String name) { this.name = name; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}
