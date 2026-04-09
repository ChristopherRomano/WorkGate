package com.workgate.fdm.model;


import java.util.List;

public class HrRep extends Poster {

	private List<EmployeeReport> hrTickets;

	/**
	 * 
	 * @param email
	 * @param password
	 */
	public HrRep(String email, String password) {
        super(email, password);

        // TODO - implement HrRep.HrRep
		throw new UnsupportedOperationException();
	}

	public List<EmployeeReport> viewClaimedRepots() {
		// TODO - implement HrRep.viewClaimedRepots
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param employeeReport
	 */
	public boolean claimTIcket(EmployeeReport employeeReport) {
		// TODO - implement HrRep.claimTIcket
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param status
	 */
	public boolean updateTicket(STATUS status) {
		// TODO - implement HrRep.updateTicket
		throw new UnsupportedOperationException();
	}

}