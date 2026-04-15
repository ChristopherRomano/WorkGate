package com.workgate.fdm.controller;

import com.workgate.fdm.DTO.ItTicketUpdateRequest;
import com.workgate.fdm.model.*;
import com.workgate.fdm.repository.LeaveRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ItTicketController {
    
    @Autowired
    LeaveRequestRepository leaveRequestRepository;

    @RequestMapping("/itTickets")
    public List<ItTicket> getTickets () 
    {
        return List.of();
    }

    @RequestMapping("/claimItTicket")
    public void claimTicket (@RequestBody ItTicketUpdateRequest request) 
    {
        
    }

    @PostMapping("/resolveItTicket")
    public void resolveTicket (@RequestParam int id) 
    {

    }
        
    
}
