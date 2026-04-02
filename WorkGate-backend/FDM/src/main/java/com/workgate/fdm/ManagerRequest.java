package java.com.workgate.fdm;

public abstract class ManagerRequest extends Request {

	private Manager assignedManager;

	public Manager getAssignedManager() {
		return this.assignedManager;
	}

}