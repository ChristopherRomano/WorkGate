public class ExpenseRequest extends ManagerRequest {

	private int amount;
	private CURRENCY currency;
	private String evidence;

	/**
	 * 
	 * @param employee
	 * @param creationTime
	 * @param amount
	 * @param currency
	 * @param evidence
	 * @param assignedManager
	 */
	public ExpenseRequest(Employee employee, int creationTime, float amount, CURRENCY currency, String evidence, Manager assignedManager) {
		// TODO - implement ExpenseRequest.ExpenseRequest
		throw new UnsupportedOperationException();
	}

	public int getAmount() {
		return this.amount;
	}

	public CURRENCY getCurrency() {
		return this.currency;
	}

	public String getEvidence() {
		return this.evidence;
	}

}