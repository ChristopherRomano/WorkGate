package com.workgate.fdm.DTO;

public class LeaveRequestRequest extends ManagerRequest{
    private int startOfLeave;
	private int endOfLeave;
	private String reason;

   
	public int getStartOfLeave() {
		return this.startOfLeave;
	}

	public int getEndOfLeave() {
		return this.endOfLeave;
	}

	public String getReason() {
		return this.reason;
	}

    public void setStartOfLeave(int startOfLeave) {
        this.startOfLeave = startOfLeave;
    }

    public void setEndOfLeave(int endOfLeave) {
        this.endOfLeave = endOfLeave;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

}
