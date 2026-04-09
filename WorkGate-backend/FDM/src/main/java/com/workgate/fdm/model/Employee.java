package com.workgate.fdm.model;

import java.util.List;

public class Employee extends User {

	private TAG tag;
	private String address;
	private String phoneNumber;
	private String emergencyContact;
	private String profilePicture;
	private Manager manager;
	private List<Request> requestList;
	private TaskList taskList;
	private int annualLeaveBalance;
	private String name;

	/**
	 * 
	 * @param email
	 * @param password
	 */
	public Employee(String email, String password) {
        super(email, password);
		this.address = "";
		this.phoneNumber = "";
		this.emergencyContact = "";
		this.profilePicture = "";
		this.name = "";

	}

	public boolean submitHrReport() {
		// TODO - implement Employee.submitHrReport
		throw new UnsupportedOperationException();
	}

	public boolean submitItTicket() {
		// TODO - implement Employee.submitItTicket
		throw new UnsupportedOperationException();
	}

	public boolean submitExpenseReport() {
		// TODO - implement Employee.submitExpenseReport
		throw new UnsupportedOperationException();
	}

	public boolean submitAnnualLeaveRequest() {
		// TODO - implement Employee.submitAnnualLeaveRequest
		throw new UnsupportedOperationException();
	}

	public List<Request> viewRequests() {
		// TODO - implement Employee.viewRequests
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param request
	 */
	public boolean cancelRequest(Request request) {
		// TODO - implement Employee.cancelRequest
		throw new UnsupportedOperationException();
	}

	public List<Task> viewTasks() {
		return taskList.getTasks();
	}

	/**
	 * 
	 * @param task
	 */
	public void completeTask(Task task) {
		// TODO - implement Employee.completeTask
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param tag
	 */
	public void setTag(TAG tag) {
		this.tag = tag;
	}

	/**
	 * 
	 * @param address
	 */
	public void setAddress(String address) {
		this.address = address;
	}

	/**
	 * 
	 * @param phoneNum
	 */
	public void setPhoneNum(String phoneNum) {
		// TODO - implement Employee.setPhoneNum
        this.phoneNumber = phoneNum; 
	}

	/**
	 * 
	 * @param phoneNum
	 */
	public void setEmergencyContact(String phoneNum) {
		this.emergencyContact = phoneNum;
	}

	/**
	 * 
	 * @param image
	 */
	public void setProfilePic(String image) {
		// TODO - implement Employee.setProfilePic
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param manager
	 */
	public void setManager(Manager manager) {
		this.manager = manager;
	}

	/**
	 * 
	 * @param annualLeaveBalance
	 */
	public void setAnnualLeaveBalance(int annualLeaveBalance) {
		this.annualLeaveBalance = annualLeaveBalance;
	}

	public TAG getTag() {
		return this.tag;
	}

	public int getAnnualLeaveBalance() {
		return this.annualLeaveBalance;
	}

	public List<Request> getRequestList() {
		return this.requestList;
	}

	public TaskList getTaskList() {
		return this.taskList;
	}

}
