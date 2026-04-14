package com.workgate.fdm.DTO;

public class ExpenseRejectionRequest {
    private int id;
    private String reason;

    public ExpenseRejectionRequest(){}

    public int getId() { return id; }
    public String getReason() { return reason; }

    public void setId(int id) { this.id = id; }
    public void setReason(String reason) { this.reason = reason; }
}
