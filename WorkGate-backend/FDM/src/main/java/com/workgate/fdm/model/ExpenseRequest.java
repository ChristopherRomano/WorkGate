package com.workgate.fdm.model;

import jakarta.persistence.Entity;

@Entity
public class ExpenseRequest extends ManagerRequest {

	private float amount;
	private CURRENCY currency;
	private String evidence;
	private int id;
	private static int nextId = 0;

	
	public ExpenseRequest(String employee, long creationTime, float amount, CURRENCY currency, String evidence, String assignedManager) {
		super(employee,creationTime,assignedManager);
		this.amount = amount;
		this.currency = currency;
		this.evidence = evidence;
		this.id = nextId++;

	}

	public ExpenseRequest() {

	}

	public float getAmount() {
		return this.amount;
	}

	public CURRENCY getCurrency() {
		return this.currency;
	}

	public String getEvidence() {
		return this.evidence;
	}

	public int getId() {
		return id;
	}
}