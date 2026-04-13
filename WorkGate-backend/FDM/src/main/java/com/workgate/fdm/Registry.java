package com.workgate.fdm;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class Registry {

	private static Registry instance;
	private List<User> userList;
	private List<String> clientCodeList;
	private List<ItTicket> itTickets;
	private List<EmployeeReport> hrTickets;
	private List<ManagerRequest> managerRequest;
	private final AtomicInteger taskIdCounter = new AtomicInteger(1);

	private Registry() {
		this.userList = new ArrayList<>();
		this.clientCodeList = new ArrayList<>();
		this.itTickets = new ArrayList<>();
		this.hrTickets = new ArrayList<>();
		this.managerRequest = new ArrayList<>();
	}

	public static Registry getRegistry() {
		if (instance == null) {
			instance = new Registry();
		}
		return instance;
	}

	public int nextTaskId() {
		return taskIdCounter.getAndIncrement();
	}

	public List<Employee> searchUserList() {
		return userList.stream()
				.filter(u -> u instanceof Employee)
				.map(u -> (Employee) u)
				.collect(Collectors.toList());
	}

	public Employee findEmployeeByEmail(String email) {
		return searchUserList().stream()
				.filter(e -> e.getEmail().equalsIgnoreCase(email))
				.findFirst()
				.orElse(null);
	}

	public Employee findEmployeeByName(String name) {
		return searchUserList().stream()
				.filter(e -> name.equalsIgnoreCase(e.getName()))
				.findFirst()
				.orElse(null);
	}

	public User findUserByEmail(String email) {
		return userList.stream()
				.filter(u -> u.getEmail().equalsIgnoreCase(email))
				.findFirst()
				.orElse(null);
	}

	public User findUserByUsername(String username) {
		return userList.stream()
				.filter(u -> username.equalsIgnoreCase(u.getUsername()))
				.findFirst()
				.orElse(null);
	}

	public void addUser(User user) {
		this.userList.add(user);
	}

	public void addClientCode(String clientCode) {
		this.clientCodeList.add(clientCode);
	}

	public boolean removeClientCode(String clientCode) {
		return this.clientCodeList.remove(clientCode);
	}

	public List<ItTicket> getItTickets() {
		return this.itTickets;
	}

	public boolean addItTicket(ItTicket itTicket) {
		return this.itTickets.add(itTicket);
	}

	public List<User> getUserList() {
		return this.userList;
	}

	public void setUserList(List<User> userList) {
		this.userList = userList;
	}

	public List<EmployeeReport> getEmployeeReports() {
		return this.hrTickets;
	}

	public void addEmployeeReportt(EmployeeReport employeeReport) {
		this.hrTickets.add(employeeReport);
	}

	public List<ManagerRequest> getActiveManagerRequests(Manager manager) {
		return managerRequest.stream()
				.filter(r -> r.getAssignedManager() != null
						&& r.getAssignedManager().equals(manager)
						&& r.getStatus() == STATUS.OPEN)
				.collect(Collectors.toList());
	}

	public List<ManagerRequest> getCompletedManagerRequests(Manager manager) {
		return managerRequest.stream()
				.filter(r -> r.getAssignedManager() != null
						&& r.getAssignedManager().equals(manager)
						&& r.getStatus() != STATUS.OPEN)
				.collect(Collectors.toList());
	}

	public void addManagerRequest(ManagerRequest managerRequest) {
		this.managerRequest.add(managerRequest);
	}

}
