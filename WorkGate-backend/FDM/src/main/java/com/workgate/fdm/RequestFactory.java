package java.com.workgate.fdm;

public interface RequestFactory {

	/**
	 * 
	 * @param employee
	 * @param creationTime
	 */
	Request getRequest(Employee employee, int creationTime);

}