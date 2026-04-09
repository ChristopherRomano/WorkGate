package com.workgate.fdm.DTO;

public class ManagerRequest extends EmployeeRequest{
    private String manager;
    
    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }
}
