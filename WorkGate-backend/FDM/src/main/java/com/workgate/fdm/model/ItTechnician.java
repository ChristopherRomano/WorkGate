package com.workgate.fdm.model;

import java.util.ArrayList;
import java.util.List;

public class ItTechnician extends Employee {

	private List<ItTicket> assignedTickets;

	public ItTechnician(String email, String password) {
		super(email, password);
		this.assignedTickets = new ArrayList<>();
	}

	public List<ItTicket> viewClaimedTickets() {
		return this.assignedTickets;
	}

	public void updateTicket(STATUS status) {
		// TODO - implement ItTechnician.updateTicket
		throw new UnsupportedOperationException();
	}

	public void searchEmployee(String email) {
		// TODO - implement ItTechnician.searchEmployee
		throw new UnsupportedOperationException();
	}

	public void unlockAccount(String email) {
		Employee emp = Registry.getRegistry().findEmployeeByEmail(email);
		if (emp != null) emp.unlock();
	}

	public void claimTicket(ItTicket itTicket) {
		assignedTickets.add(itTicket);
	}

}
