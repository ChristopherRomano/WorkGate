package com.workgate.fdm.model;

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

    // ── Status helpers ────────────────────────────────────────────────────────

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

    public String getTitle()          { return title; }
    public String getDescription()    { return description; }
    public String getCategory()       { return category; }
    public String getClaimedByEmail() { return claimedByEmail; }

    public void setClaimedByEmail(String email) { this.claimedByEmail = email; }
}
