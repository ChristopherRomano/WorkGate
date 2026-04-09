package com.workgate.fdm.DTO;

import com.workgate.fdm.model.CURRENCY;

public class ExpenseRequestRequest extends ManagerRequest{
    private float amount;
	private CURRENCY currency;
	private String evidence;

    ExpenseRequestRequest(){}

    public float getAmount() { return this.amount; }
	public CURRENCY getCurrency() { return this.currency; }
	public String getEvidence() { return this.evidence; }

    public void setAmount(int amount) { this.amount = amount; }
    public void setCurrency(CURRENCY currency) { this.currency = currency; }
    public void setEvidence(String evidence) { this.evidence = evidence; }
}
