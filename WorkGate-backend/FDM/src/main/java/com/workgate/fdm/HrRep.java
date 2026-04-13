package com.workgate.fdm;

import java.util.ArrayList;
import java.util.List;

public class HrRep extends Poster {

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

	public boolean updateTicket(STATUS status) {
		// TODO - implement HrRep.updateTicket
		throw new UnsupportedOperationException();
	}

}
