package com.workgate.fdm.DTO;

import com.workgate.fdm.model.TAG;;

public class NewEmployeeRequest {
    private String email;
    private String managerEmail;
    private String name;
    private String password;
    private TAG tag;

    private NewEmployeeRequest(){}

    public String getEmail() { return email;}
    public String getName() { return name;}
    public String getPassword() { return password; }
    public String getManagerEmail() { return managerEmail; }
    public TAG getTag() { return tag; }

    public void setEmail(String email) { this.email = email; }
    public void setManagerName(String managerEmail) { this.managerEmail = managerEmail; }
    public void setTag(TAG tag) { this.tag = tag; }
}
