package com.workgate.fdm;

import java.util.List;

public class ItTechnician extends Employee {

	private List<ItTicket> assignedTickets;

	/**
	 * 
	 * @param email
	 * @param password
	 */
	public ItTechnician(String email, String password) {
        super(email, password);
		// TODO - implement ItTechnician.ItTechnician
		throw new UnsupportedOperationException();
	}

	public List<ItTicket> viewClaimedTickets() {
		// TODO - implement ItTechnician.viewClaimedTickets
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param status
	 */
	public void updateTicket(STATUS status) {
		// TODO - implement ItTechnician.updateTicket
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param email
	 */
	public void searchEmployee(String email) {
		// TODO - implement ItTechnician.searchEmployee
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param email
	 */
	public void unlockAccount(String email) {
		// TODO - implement ItTechnician.unlockAccount
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param itTicket
	 */
	public void claimTicket(ItTicket itTicket) {
		// TODO - implement ItTechnician.claimTicket
		throw new UnsupportedOperationException();
	}

}