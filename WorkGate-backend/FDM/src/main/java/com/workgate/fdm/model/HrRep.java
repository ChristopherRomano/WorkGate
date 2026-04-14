package com.workgate.fdm.model;

import java.util.ArrayList;
import java.util.List;

public class HrRep extends Employee {

	private List<EmployeeReport> hrTickets;

	public HrRep(String email, String password) {
		super(email, password);
		this.hrTickets = new ArrayList<>();
	}

	public List<EmployeeReport> viewClaimedRepots() {
		return this.hrTickets;
	}

	public boolean claimTIcket(EmployeeReport employeeReport) {
		return hrTickets.add(employeeReport);
	}
}
