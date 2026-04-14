package com.workgate.fdm.DTO;

import com.workgate.fdm.model.TAG;;

public class NewEmployeeRequest {
    private String email;
    private String managerName;
    private TAG tag;

    private NewEmployeeRequest(){}

    public String getEmail() { return email;}
    public String getManagerName() { return managerName; }
    public TAG getTag() { return tag; }

    public void setEmail(String email) { this.email = email; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public void setTag(TAG tag) { this.tag = tag; }
}
