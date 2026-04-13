package com.workgate.fdm;

import java.util.ArrayList;
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

	public Employee(String email, String password) {
		super(email, password);
		this.taskList = new TaskList();
		this.requestList = new ArrayList<>();
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
		return this.requestList;
	}

	public boolean cancelRequest(Request request) {
		return this.requestList.remove(request);
	}

	public List<Task> viewTasks() {
		return this.taskList.getTasks();
	}

	public void completeTask(Task task) {
		task.setCompletion(true);
	}

	public void setTag(TAG tag)                             { this.tag = tag; }
	public void setAddress(String address)                  { this.address = address; }
	public void setPhoneNum(String phoneNum)                { this.phoneNumber = phoneNum; }
	public void setEmergencyContact(String contact)         { this.emergencyContact = contact; }
	public void setProfilePic(String image)                 { this.profilePicture = image; }
	public void setManager(Manager manager)                 { this.manager = manager; }
	public void setAnnualLeaveBalance(int balance)          { this.annualLeaveBalance = balance; }

	public TAG getTag()                     { return this.tag; }
	public int getAnnualLeaveBalance()      { return this.annualLeaveBalance; }
	public List<Request> getRequestList()   { return this.requestList; }
	public TaskList getTaskList()           { return this.taskList; }
	public Manager getManager()             { return this.manager; }
	public String getAddress()              { return this.address; }
	public String getPhoneNumber()          { return this.phoneNumber; }

}
