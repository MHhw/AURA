package com.aura.aura_connect.main.presentation;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    private static final Logger log = LoggerFactory.getLogger(MainController.class);

    @GetMapping("/")
    public Map<String, Object> readRoot() {
        return buildPayload();
    }

    @GetMapping("/api/v1/main")
    public Map<String, Object> readMain() {
        return buildPayload();
    }

    @GetMapping("/api/v1/hi")
    public Map<String, String> sayHi() {
        log.info("hi");
        return Map.of("message", "hi");
    }

    private Map<String, Object> buildPayload() {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("title", "Aura Connect Dashboard");
        payload.put("message", "This data is served directly from Spring without requiring a login.");
        payload.put("timestamp", Instant.now().toString());
        payload.put(
                "metrics",
                Map.of(
                        "activeProjects", 4,
                        "pendingApprovals", 2,
                        "teamAvailability", "92%"));

        payload.put(
                "highlights",
                List.of(
                        Map.of(
                                "id", "next-meeting",
                                "label", "Next leadership sync",
                                "value", "Mon, 10:00 KST"),
                        Map.of(
                                "id", "top-priority",
                                "label", "Q4 launch readiness",
                                "value", "On Track"),
                        Map.of(
                                "id", "recent-activity",
                                "label", "Recent activity",
                                "value", "5 new updates")));

        return payload;
    }
}

