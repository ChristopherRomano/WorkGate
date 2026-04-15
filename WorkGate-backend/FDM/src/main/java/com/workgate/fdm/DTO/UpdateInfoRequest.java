package com.workgate.fdm.DTO;

import java.util.List;

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
    // Consultant-only fields
    private List<String> keySkills;
    private String clientCode;
    private String endDate;

    public UpdateInfoRequest() {}

    public String getEmail()                  { return email; }
    public String getRole()                   { return role; }
    public String getAddress()                { return address; }
    public String getPhoneNumber()            { return phoneNumber; }
    public String getEmergencyContactNumber() { return emergencyContactNumber; }
    public String getEmergencyContactName()   { return emergencyContactName; }
    public String getProfilePicture()         { return profilePicture; }
    public String getName()                   { return name; }
    public String getSurname()                { return surname; }
    public List<String> getKeySkills()        { return keySkills; }
    public String getClientCode()             { return clientCode; }
    public String getEndDate()                { return endDate; }

    public void setEmail(String email)                                    { this.email = email; }
    public void setRole(String role)                                      { this.role = role; }
    public void setAddress(String address)                                { this.address = address; }
    public void setPhoneNumber(String phoneNumber)                        { this.phoneNumber = phoneNumber; }
    public void setEmergencyContactNumber(String emergencyContactNumber)  { this.emergencyContactNumber = emergencyContactNumber; }
    public void setEmergencyContactName(String emergencyContactName)      { this.emergencyContactName = emergencyContactName; }
    public void setProfilePicture(String profilePicture)                  { this.profilePicture = profilePicture; }
    public void setName(String name)                                      { this.name = name; }
    public void setSurname(String surname)                                { this.surname = surname; }
    public void setKeySkills(List<String> keySkills)                      { this.keySkills = keySkills; }
    public void setClientCode(String clientCode)                          { this.clientCode = clientCode; }
    public void setEndDate(String endDate)                                { this.endDate = endDate; }
}
