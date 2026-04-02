package com.workgate.fdm;

import java.util.List;


public class Registry {

	private static Registry Instance;
	private List<User> userList;
	private List<String> clientCodeList;
	private List<ItTicket> itTickets;
	private List<EmployeeReport> hrTickets;
	private List<ManagerRequest> managerRequest;

	private Registry() {
		// TODO - implement Registry.Registry
		throw new UnsupportedOperationException();
	}

	public static Registry getRegistry() {
		// TODO - implement Registry.getRegistry
		throw new UnsupportedOperationException();
	}

	public List<Employee> searchUserList() {
		// TODO - implement Registry.searchUserList
		throw new UnsupportedOperationException();
	}

	public List<ItTicket> getItTickets() {
		return this.itTickets;
	}

	/**
	 * 
	 * @param itTickets
	 */
	public boolean addItTicket(ItTicket itTickets) {
		// TODO - implement Registry.addItTicket
		throw new UnsupportedOperationException();
	}

	public List<User> getUserList() {
		return this.userList;
	}

	/**
	 * 
	 * @param userList
	 */
	public void setUserList(List<User> userList) {
		this.userList = userList;
	}

	public List<EmployeeReport> getEmployeeReports() {
		// TODO - implement Registry.getEmployeeReports
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param employeeReport
	 */
	public void addEmployeeReportt(EmployeeReport employeeReport) {
		// TODO - implement Registry.addEmployeeReportt
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param manager
	 */
	public List<ManagerRequest> getActiveManagerRequests(Manager manager) {
		// TODO - implement Registry.getActiveManagerRequests
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param manager
	 */
	public List<ManagerRequest> getCompletedManagerRequests(Manager manager) {
		// TODO - implement Registry.getCompletedManagerRequests
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param managerRequest
	 */
	public void addManagerRequest(ManagerRequest managerRequest) {
		// TODO - implement Registry.addManagerRequest
		throw new UnsupportedOperationException();
	}

}