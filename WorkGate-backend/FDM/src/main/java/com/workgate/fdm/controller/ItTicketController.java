package com.workgate.fdm.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.workgate.fdm.model.ItTicket;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ItTicketController {
    @RequestMapping("/itTickets")
    public List<ItTicket> getItTickets (@RequestParam String Username) {
        return List.of();
    }
}
