package com.workgate.fdm.DTO;

import com.workgate.fdm.model.TAG;

public class LoginResponse {
    private String username;
    private TAG tag;

    public LoginResponse(){}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public TAG getTag() { return tag; }
    public void setTag(TAG tag) { this.tag = tag; }
}
