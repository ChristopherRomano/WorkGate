package com.workgate.fdm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.DiscriminatorValue;

import java.util.List;

@Entity
@DiscriminatorValue("IT_TICKET")
public class ItTicket extends Request {

    private String title;
    private String description;
    private String category;
    private String claimedByEmail; // null = unclaimed

    public ItTicket(String username, long creationTime, String title, String description, String category) {
        super(username, creationTime);
        this.title       = title;
        this.description = description;
        this.category    = category;
    }

	public ItTicket() {

	}
    /** Advance: OPEN → IN_PROGRESS → RESOLVED */
    public boolean advance() {
        if (getStatus() == STATUS.OPEN) {
            updateStatus(STATUS.IN_PROGRESS);
            return true;
        }
        if (getStatus() == STATUS.IN_PROGRESS) {
            updateStatus(STATUS.RESOLVED);
            return true;
        }
        return false;
    }

    // ── Getters / setters ─────────────────────────────────────────────────────
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }
    public String getTitle()          { return title; }
    public String getDescription()    { return description; }
    public String getCategory()       { return category; }
    public String getClaimedByEmail() { return claimedByEmail; }

    public void setClaimedByEmail(String email) { this.claimedByEmail = email; }
}
