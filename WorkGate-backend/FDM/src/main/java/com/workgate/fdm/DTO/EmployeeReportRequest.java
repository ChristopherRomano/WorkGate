package com.workgate.fdm.DTO;

public class EmployeeReportRequest extends EmployeeRequest{
    private String content;
    private String title;
    private boolean isAnonymous;

    public EmployeeReportRequest(){}

    public String getContent() { return content; }
    public boolean getIsAnonymous (){ return isAnonymous; }
    public String getTitle() { return title; }

    public void setAnonymous(boolean isAnonymous) { this.isAnonymous = isAnonymous; }
    public void setContent(String content) { this.content = content; }
    public void setTitle(String title) { this.title = title; }
}
