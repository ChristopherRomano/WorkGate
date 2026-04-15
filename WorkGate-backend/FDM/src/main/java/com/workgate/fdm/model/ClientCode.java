package com.workgate.fdm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.UUID;

@Entity
public class ClientCode {

    @Id
    private String id;
    private String code;
    private String client;
    private String sector;

    public ClientCode() {}

    public ClientCode(String code, String client, String sector) {
        this.id     = UUID.randomUUID().toString();
        this.code   = code.toUpperCase();
        this.client = client;
        this.sector = sector;
    }

    public String getId()     { return id; }
    public String getCode()   { return code; }
    public String getClient() { return client; }
    public String getSector() { return sector; }
}
