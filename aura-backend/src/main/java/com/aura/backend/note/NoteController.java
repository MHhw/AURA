package com.aura.backend.note;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public List<NoteResponse> getNotes() {
        return noteService.getAllNotes().stream()
                .map(NoteResponse::from)
                .toList();
    }

    @PostMapping
    public NoteResponse createNote(@RequestBody CreateNoteRequest request) {
        Note note = noteService.createNote(request.title(), request.content());
        return NoteResponse.from(note);
    }

    public record CreateNoteRequest(String title, String content) {
    }

    public record NoteResponse(Long id, String title, String content, LocalDateTime createdAt) {

        public static NoteResponse from(Note note) {
            return new NoteResponse(
                    note.getId(),
                    note.getTitle(),
                    note.getContent(),
                    note.getCreatedAt());
        }
    }
}