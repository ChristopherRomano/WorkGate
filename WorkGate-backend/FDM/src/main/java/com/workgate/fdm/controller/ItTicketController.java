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
    @GetMapping("/itTickets")
    public List<ItTicket> getTickets() {
        return itTicketRepository.findAll();
    }

    // GET TICKETS FOR A SPECIFIC EMPLOYEE
    @GetMapping("/itTickets/employee")
    public List<ItTicket> getEmployeeTickets(@RequestParam String username) {
        return itTicketRepository.findByEmployeeEmail(username);
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

    // RESOLVE TICKET WITH RESPONSE MESSAGE
    @PostMapping("/resolveItTicket")
    public void resolveTicket(@RequestBody java.util.Map<String, Object> body) {
        Object idValue = body.get("id");
        if (idValue == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "id is required");
        }

        Long id = Long.valueOf(String.valueOf(idValue));
        ItTicket ticket = itTicketRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        String message = body.get("message") != null ? String.valueOf(body.get("message")).trim() : "";
        ticket.setResolutionMessage(message);
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
        ticket.setCreationTime(request.getCreationTime());
        ticket.setEmployeeEmail(request.getUsername());
        ticket.updateStatus(STATUS.OPEN);

        itTicketRepository.save(ticket);
    }
}