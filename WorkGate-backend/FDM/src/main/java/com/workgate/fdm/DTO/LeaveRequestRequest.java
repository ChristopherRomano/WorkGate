package com.workgate.fdm.DTO;

public class LeaveRequestRequest extends ManagerRequest{
    private long startOfLeave;
	private long endOfLeave;
	private String reason;

	public LeaveRequestRequest(){}
   
	public long getStartOfLeave() { return this.startOfLeave; }
	public long getEndOfLeave() { return this.endOfLeave; }
	public String getReason() { return this.reason; }

    public void setStartOfLeave(long startOfLeave) { this.startOfLeave = startOfLeave; }
    public void setEndOfLeave(long endOfLeave) { this.endOfLeave = endOfLeave; }
    public void setReason(String reason) { this.reason = reason; }
}
