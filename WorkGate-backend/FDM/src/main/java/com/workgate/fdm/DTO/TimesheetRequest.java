package com.workgate.fdm.DTO;

import java.util.List;

public class TimesheetRequest {
    private List<Float> clientHours;
    private List<Float> interalHours;

    public TimesheetRequest (){}
    
    public List<Float> getClientHours() { return clientHours; }
    public List<Float> getInteralHours() { return interalHours; }

    public void setClientHours(List<Float> clientHours) { this.clientHours = clientHours; }
    public void setInteralHours(List<Float> interalHours) { this.interalHours = interalHours; }
}
