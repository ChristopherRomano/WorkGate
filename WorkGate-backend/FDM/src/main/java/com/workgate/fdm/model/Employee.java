package com.workgate.fdm.model;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
public class Employee extends User {

	@Enumerated(EnumType.STRING)
	private TAG tag;

	private String address;
	private String phoneNumber;
	private String emergencyContact;
	private String profilePicture;

	@ManyToOne
	private Manager manager;

	@OneToMany(mappedBy = "username")
	private List<Request> requestList;


	@OneToOne(cascade = CascadeType.ALL)
	private TaskList taskList;

	private int annualLeaveBalance;
	private String name;
    @Id
    private long id;


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
        this.taskList = new TaskList();
        this.requestList = new ArrayList<>();
	}

	public Employee() {

	}


	public boolean submitHrReport() {
		throw new UnsupportedOperationException();
	}

	public boolean submitItTicket() {
		throw new UnsupportedOperationException();
	}

	public boolean submitExpenseReport() {
		throw new UnsupportedOperationException();
	}

	public boolean submitAnnualLeaveRequest() {
		throw new UnsupportedOperationException();
	}

	public List<Request> viewRequests() {
		return requestList;
	}

	public boolean cancelRequest(Request request) {

		return this.requestList.remove(request);
	}

	public List<Task> viewTasks() {

		return this.taskList.getTasks();
	}

	public void completeTask(Task task) {
		throw new UnsupportedOperationException();
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

	public void setId(long id) {
		this.id = id;
	}


}