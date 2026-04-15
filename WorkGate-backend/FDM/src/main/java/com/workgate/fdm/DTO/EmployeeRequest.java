package com.workgate.fdm.DTO;
public class EmployeeRequest {

    private String username;
    private int id;
    private long creationTime;

    public EmployeeRequest(){}

    public String getUsername() { return username; }
    public long getCreationTime() { return creationTime; }
    
    public void setCreationTime(long creationTIme) { this.creationTime = creationTIme; }
    public void setUsername(String username) { this.username = username; }
}
