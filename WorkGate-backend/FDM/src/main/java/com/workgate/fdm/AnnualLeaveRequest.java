package java.com.workgate.fdm;

public class AnnualLeaveRequest extends ManagerRequest {

	private int startOfLeave;
	private int endOfLeave;
	private String reason;

	/**
	 * 
	 * @param employee
	 * @param creationTime
	 * @param assignedManger
	 * @param reason
	 */
	public AnnualLeaveRequest(Employee employee, int creationTime, Manager assignedManger, String reason) {
		// TODO - implement AnnualLeaveRequest.AnnualLeaveRequest
		throw new UnsupportedOperationException();
	}

	public int getStartOfLeave() {
		return this.startOfLeave;
	}

	public int getEndOfLeave() {
		return this.endOfLeave;
	}

	public String getReason() {
		return this.reason;
	}

}