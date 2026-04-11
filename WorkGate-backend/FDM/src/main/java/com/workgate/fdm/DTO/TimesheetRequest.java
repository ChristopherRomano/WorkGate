package com.workgate.fdm.DTO;

import java.util.List;

public class TimesheetRequest {
    private String username;
    private List<Float> clientHours;
    private List<Float> interalHours;
    private long dateOfSubmission;

    public TimesheetRequest (){}
    
    public List<Float> getClientHours() { return clientHours; }
    public List<Float> getInteralHours() { return interalHours; }
    public long getDateOfSubmission() { return dateOfSubmission; }
    public String getUsername() { return username; }

    public void setClientHours(List<Float> clientHours) { this.clientHours = clientHours; }
    public void setInteralHours(List<Float> interalHours) { this.interalHours = interalHours; }
    public void setDateOfSubmission(long dateOfSubmission) { this.dateOfSubmission = dateOfSubmission; }
    public void setUsername(String username) { this.username = username; }
}
