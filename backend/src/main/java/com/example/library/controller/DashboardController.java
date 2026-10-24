package com.example.library.controller;
import com.example.library.repository.BookRepository;
import com.example.library.repository.MemberRepository;
import com.example.library.repository.LoanRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/dashboard")
public class DashboardController {
    private final BookRepository books; private final MemberRepository members; private final LoanRepository loans;
    public DashboardController(BookRepository books, MemberRepository members, LoanRepository loans){this.books=books;this.members=members;this.loans=loans;}
    @GetMapping public Map<String,Long> summary(){
        long totalCopies=books.findAll().stream().mapToLong(b->b.getTotalCopies()==null?0:b.getTotalCopies()).sum();
        long available=books.findAll().stream().mapToLong(b->b.getAvailableCopies()==null?0:b.getAvailableCopies()).sum();
        return Map.of("bookTitles",books.count(),"totalCopies",totalCopies,"availableCopies",available,"members",members.count(),"activeLoans",loans.countByStatus("ACTIVE"));
    }
}
