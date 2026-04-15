package com.workgate.fdm.DTO;

public class ItTicketUpdateRequest {
    private long id;
    private String name;
    private String claimByEmail;

    public ItTicketUpdateRequest() {}

    public long getId() {
        return id;
    }
    public String getName() {
        return name;
    }

    public String getClaimByEmail() {
        return claimByEmail;
    }
}
