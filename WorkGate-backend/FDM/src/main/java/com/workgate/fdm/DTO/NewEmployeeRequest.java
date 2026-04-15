package com.workgate.fdm.DTO;

import com.workgate.fdm.model.TAG;

public class NewEmployeeRequest {
    private String email;
    private String managerEmail;
    private String name;
    private String password;
    private TAG tag;

    public NewEmployeeRequest(){}

    public String getEmail() { return email;}
    public String getName() { return name;}
    public String getPassword() { return password; }
    public String getManagerEmail() { return managerEmail; }
    public TAG getTag() { return tag; }

    public void setEmail(String email) { this.email = email; }
    public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }
    public void setName(String name) { this.name = name; }
    public void setPassword(String password) { this.password = password; }
    public void setTag(TAG tag) { this.tag = tag; }
}
