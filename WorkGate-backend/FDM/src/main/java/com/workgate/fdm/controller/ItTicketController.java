// package com.workgate.fdm.controller;

// import com.workgate.fdm.model.*;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.LinkedHashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/it-tickets")
// @CrossOrigin(origins = "*")
// public class ItTicketController {

//     private final Registry registry = Registry.getRegistry();

//     /**
//      * GET /api/it-tickets
//      * Returns all IT tickets (for IT management view).
//      */
//     @GetMapping
//     public ResponseEntity<List<Map<String, Object>>> getAll() {
//         List<Map<String, Object>> result = registry.getItTickets().stream()
//                 .map(this::toMap)
//                 .collect(Collectors.toList());
//         return ResponseEntity.ok(result);
//     }

//     /**
//      * POST /api/it-tickets
//      * Body: { username, title, description, category }
//      * Creates a new IT support ticket submitted by an employee.
//      */
//     @PostMapping
//     public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
//         String username    = body.get("username");
//         String title       = body.get("title");
//         String description = body.get("description");
//         String category    = body.getOrDefault("category", "General");

//         if (username == null || username.isBlank()) return ResponseEntity.badRequest().body("Username is required.");
//         if (title == null || title.isBlank())       return ResponseEntity.badRequest().body("Title is required.");

//         ItTicket ticket = new ItTicket(username, System.currentTimeMillis(), title, description, category);
//         registry.addItTicket(ticket);
//         return ResponseEntity.ok(toMap(ticket));
//     }

//     /**
//      * PUT /api/it-tickets/{id}/claim
//      * Body: { techEmail }
//      * Claims an unclaimed ticket for an IT technician.
//      */
//     @PutMapping("/{id}/claim")
//     public ResponseEntity<?> claim(@PathVariable int id, @RequestBody Map<String, String> body) {
//         ItTicket ticket = findById(id);
//         if (ticket == null) return ResponseEntity.notFound().build();
//         if (ticket.getClaimedByEmail() != null)
//             return ResponseEntity.badRequest().body("Ticket is already claimed.");

//         String techEmail = body.get("techEmail");
//         if (techEmail == null || techEmail.isBlank()) return ResponseEntity.badRequest().body("Tech email required.");

//         ticket.setClaimedByEmail(techEmail);
//         return ResponseEntity.ok(toMap(ticket));
//     }

//     /**
//      * PUT /api/it-tickets/{id}/advance
//      * Advances ticket status: OPEN → IN_PROGRESS → RESOLVED.
//      */
//     @PutMapping("/{id}/advance")
//     public ResponseEntity<?> advance(@PathVariable int id) {
//         ItTicket ticket = findById(id);
//         if (ticket == null) return ResponseEntity.notFound().build();
//         if (!ticket.advance())
//             return ResponseEntity.badRequest().body("Ticket is already resolved.");
//         return ResponseEntity.ok(toMap(ticket));
//     }

//     // ── Helpers ───────────────────────────────────────────────────────────────

//     private ItTicket findById(int id) {
//         return registry.getItTickets().stream()
//                 .filter(t -> t.getId() == id)
//                 .findFirst()
//                 .orElse(null);
//     }

//     private Map<String, Object> toMap(ItTicket t) {
//         Map<String, Object> m = new LinkedHashMap<>();
//         m.put("id",            t.getId());
//         m.put("username",      t.getEmployeeUsername());
//         m.put("title",         t.getTitle());
//         m.put("description",   t.getDescription());
//         m.put("category",      t.getCategory());
//         m.put("status",        t.getStatus().name());
//         m.put("claimedByEmail", t.getClaimedByEmail());
//         m.put("createdAt",     t.getCreationTime());
//         return m;
//     }
// }
