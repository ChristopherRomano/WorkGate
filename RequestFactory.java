public interface RequestFactory {

	/**
	 * 
	 * @param employee
	 * @param creationTime
	 */
	Request getRequest(Employee employee, int creationTime);

}