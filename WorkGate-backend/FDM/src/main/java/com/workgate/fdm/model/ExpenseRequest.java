package com.workgate.fdm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.DiscriminatorValue;

@Entity
@DiscriminatorValue("EXPENSE_REQUEST")
public class ExpenseRequest extends ManagerRequest {

	private float amount;
	private CURRENCY currency;
	private String evidence;
	
	public ExpenseRequest(String employee, long creationTime, float amount, CURRENCY currency, String evidence, String assignedManager) {
		super(employee,creationTime,assignedManager);
		this.amount = amount;
		this.currency = currency;
		this.evidence = evidence;
	}

	public ExpenseRequest() {
		super();
	}

	public void setAmount(float amount) {
		this.amount = amount;
	}

	public void setCurrency(CURRENCY currency) {
		this.currency = currency;
	}

	public void setEvidence(String evidence) {
		this.evidence = evidence;
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
}