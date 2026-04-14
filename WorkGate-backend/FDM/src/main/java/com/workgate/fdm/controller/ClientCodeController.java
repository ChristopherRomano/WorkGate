package com.workgate.fdm.controller;

import com.workgate.fdm.model.ClientCode;
import com.workgate.fdm.model.Registry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client-codes")
@CrossOrigin(origins = "*")
public class ClientCodeController {

    private final Registry registry = Registry.getRegistry();

    /**
     * GET /api/client-codes
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        List<Map<String, Object>> result = registry.getClientCodes().stream()
                .map(this::toMap)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/client-codes
     * Body: { code, client, sector }
     */
    @PostMapping
    public ResponseEntity<?> add(@RequestBody Map<String, String> body) {
        String code   = body.get("code");
        String client = body.get("client");
        String sector = body.getOrDefault("sector", "Other");

        if (code == null || code.isBlank())     return ResponseEntity.badRequest().body("Code is required.");
        if (client == null || client.isBlank()) return ResponseEntity.badRequest().body("Client name is required.");

        String normalised = code.trim().toUpperCase();
        if (registry.clientCodeExists(normalised))
            return ResponseEntity.badRequest().body("Code '" + normalised + "' already exists.");

        ClientCode cc = new ClientCode(normalised, client.trim(), sector.trim());
        registry.addClientCode(cc);
        return ResponseEntity.ok(toMap(cc));
    }

    /**
     * DELETE /api/client-codes/{code}
     */
    @DeleteMapping("/{code}")
    public ResponseEntity<?> remove(@PathVariable String code) {
        if (!registry.removeClientCode(code))
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("message", "Client code removed."));
    }

    private Map<String, Object> toMap(ClientCode cc) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",     cc.getId());
        m.put("code",   cc.getCode());
        m.put("client", cc.getClient());
        m.put("sector", cc.getSector());
        return m;
    }
}
