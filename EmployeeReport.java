public class EmployeeReport extends Request {

	private string content;
	private string title;
	private bool anonymous;

	/**
	 * 
	 * @param employee
	 * @param creationTime
	 * @param content
	 * @param title
	 * @param privacy
	 */
	public EmployeeReport(Employee employee, int creationTime, String content, String title, bool privacy) {
		// TODO - implement EmployeeReport.EmployeeReport
		throw new UnsupportedOperationException();
	}

	public string getContent() {
		return this.content;
	}

	public string getTitle() {
		return this.title;
	}

	public bool getAnonymous() {
		return this.anonymous;
	}

}