package com.workgate.fdm.DTO;

import com.workgate.fdm.model.CURRENCY;
import com.workgate.fdm.model.STATUS;

public class ExpenseRequestRequest extends ManagerRequest{
    private float amount;
	private CURRENCY currency;
	private String evidence;
    private long purchaseDate;
    private String reason;
    private long id;
    private STATUS status;

    ExpenseRequestRequest(){}

    public float getAmount() { return this.amount; }
	public CURRENCY getCurrency() { return this.currency; }
	public String getEvidence() { return this.evidence; }
    public long getPurchaseDate() { return purchaseDate; }
    public String getReason() { return reason; }
    public long getId() {return id;}
    public STATUS getStatus() {return status;}

    public void setAmount(int amount) { this.amount = amount; }
    public void setCurrency(CURRENCY currency) { this.currency = currency; }
    public void setEvidence(String evidence) { this.evidence = evidence; }
    public void setPurchaseDate(long purchaseDate) { this.purchaseDate = purchaseDate; }
    public void setReason(String reason) { this.reason = reason; }
}
