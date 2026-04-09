package com.workgate.fdm.DTO;

import java.util.List;

public class ItTicketRequest extends EmployeeRequest{
    private String title;
	private String description;
	private String category;
	private List<String> evidence;

    public String getTitle() {
		return this.title;
	}

	public String getDescription() {
		return this.description;
	}

	public String getCategory() {
		return this.category;
	}

	public List<String> getEvidence() {
		return this.evidence;
	}

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setEvidence(List<String> evidence) {
        this.evidence = evidence;
    }
}
