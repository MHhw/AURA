package com.aura.backend.note;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;

    public List<Note> getAllNotes() {
        return noteRepository.findAllByOrderByCreatedAtDesc();
    }

    public Note createNote(String title, String content) {
        Note note = Note.builder()
                .title(title)
                .content(content)
                .build();
        return noteRepository.save(note);
    }
}
