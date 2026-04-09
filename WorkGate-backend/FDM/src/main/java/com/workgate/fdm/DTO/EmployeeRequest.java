package com.workgate.fdm.DTO;

import com.workgate.fdm.model.STATUS;

public class EmployeeRequest {

    private String username;
    private int creationTime;
    private STATUS status;

    public String getUsername() {
        return username;
    }
    public int getCreationTime() {
        return creationTime;
    }

    public STATUS getStatus() {
        return status;
    }
    
    public void setCreationTime(int creationTIme) {
        this.creationTime = creationTIme;
    }

    public void setStatus(STATUS status) {
        this.status = status;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
