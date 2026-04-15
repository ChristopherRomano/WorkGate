package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.ItTicketUpdateRequest;
import com.workgate.fdm.model.ItTicket;
import com.workgate.fdm.model.STATUS;
import com.workgate.fdm.repository.ItTicketRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ItTicketController {

    @Autowired
    ItTicketRequestRepository itTicketRepository;

    // GET ALL TICKETS
    @RequestMapping("/itTickets")
    public List<ItTicket> getTickets() {
        return itTicketRepository.findAll();
    }

    // CLAIM TICKET
    @RequestMapping("/claimItTicket")
    public void claimTicket(@RequestBody ItTicketUpdateRequest request) {

        ItTicket ticket = itTicketRepository.findById(request.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        ticket.setClaimedByEmail(request.getClaimByEmail());

        itTicketRepository.save(ticket);
    }

    // RESOLVE TICKET
    @PostMapping("/resolveItTicket")
    public void resolveTicket(@RequestParam long id, STATUS status) {

        ItTicket ticket = itTicketRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        ticket.updateStatus(status);

        itTicketRepository.save(ticket);
    }
}