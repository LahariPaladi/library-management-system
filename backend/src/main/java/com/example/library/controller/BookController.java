package com.example.library.controller;

import com.example.library.model.Book;
import com.example.library.repository.BookRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/books")
public class BookController {
    private final BookRepository books;
    public BookController(BookRepository books){this.books=books;}

    @GetMapping public List<Book> all(@RequestParam(required=false) String search) {
        return search == null || search.isBlank() ? books.findAll() : books.search(search.trim());
    }
    @GetMapping("/{id}") public Book one(@PathVariable Long id) {
        return books.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Book create(@Valid @RequestBody Book book) {
        if (book.getTotalCopies() == null || book.getAvailableCopies() == null ||
            book.getTotalCopies() < 0 || book.getAvailableCopies() < 0 ||
            book.getAvailableCopies() > book.getTotalCopies())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Copy counts must be non-negative and available copies cannot exceed total copies");
        return books.save(book);
    }
    @PutMapping("/{id}") public Book update(@PathVariable Long id, @Valid @RequestBody Book input) {
        Book b = one(id);
        if (input.getTotalCopies() == null || input.getAvailableCopies() == null ||
            input.getTotalCopies() < 0 || input.getAvailableCopies() < 0 ||
            input.getAvailableCopies() > input.getTotalCopies())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid copy counts");
        b.setTitle(input.getTitle()); b.setAuthor(input.getAuthor()); b.setIsbn(input.getIsbn());
        b.setCategory(input.getCategory()); b.setTotalCopies(input.getTotalCopies());
        b.setAvailableCopies(input.getAvailableCopies());
        return books.save(b);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) {
        if (!books.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        books.deleteById(id);
    }
}
