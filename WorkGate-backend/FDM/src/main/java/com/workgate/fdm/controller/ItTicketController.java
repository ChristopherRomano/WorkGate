package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.ItTicketRequest;
import com.workgate.fdm.DTO.ClaimRequest;
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
    @PostMapping("/claimItTicket")
    public void claimTicket(@RequestBody ClaimRequest request) {

        ItTicket ticket = itTicketRepository.findById(request.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        ticket.setClaimedByEmail(request.getEmail());
        ticket.updateStatus(STATUS.IN_PROGRESS);

        itTicketRepository.save(ticket);
    }

    // RESOLVE TICKET
    @RequestMapping("/resolveItTicket")
    public void resolveTicket(@RequestParam long id) {

        ItTicket ticket = itTicketRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        ticket.updateStatus(STATUS.RESOLVED);

        itTicketRepository.save(ticket);
    }

    // RESOLVE TICKET
    @PostMapping("/createItTicket")
    public void createTicket(@RequestBody ItTicketRequest request) {
        ItTicket ticket = new ItTicket();

        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());

        itTicketRepository.save(ticket);
    }
}