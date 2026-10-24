package com.example.library.controller;

import com.example.library.model.Book;
import com.example.library.model.Loan;
import com.example.library.model.Member;
import com.example.library.repository.BookRepository;
import com.example.library.repository.LoanRepository;
import com.example.library.repository.MemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/loans")
public class LoanController {
    private final LoanRepository loans; private final BookRepository books; private final MemberRepository members;
    public LoanController(LoanRepository loans, BookRepository books, MemberRepository members){this.loans=loans;this.books=books;this.members=members;}
    @GetMapping public List<Loan> all(){return loans.findAllByOrderByIssueDateDesc();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @Transactional
    public Loan issue(@RequestBody Map<String, Long> request){
        Long bookId=request.get("bookId"), memberId=request.get("memberId");
        if(bookId==null || memberId==null)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"bookId and memberId are required");
        Book book=books.findById(bookId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Book not found"));
        Member member=members.findById(memberId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Member not found"));
        if(book.getAvailableCopies()<=0)throw new ResponseStatusException(HttpStatus.CONFLICT,"No available copies");
        book.setAvailableCopies(book.getAvailableCopies()-1); books.save(book);
        Loan loan=new Loan(); loan.setBook(book); loan.setMember(member); loan.setIssueDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14)); loan.setStatus("ACTIVE"); return loans.save(loan);
    }
    @PutMapping("/{id}/return") @Transactional public Loan returnBook(@PathVariable Long id){
        Loan loan=loans.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Loan not found"));
        if(!"ACTIVE".equals(loan.getStatus()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Loan has already been returned");
        loan.setStatus("RETURNED"); loan.setReturnDate(LocalDate.now());
        Book book=loan.getBook(); book.setAvailableCopies(Math.min(book.getTotalCopies(),book.getAvailableCopies()+1)); books.save(book);
        return loans.save(loan);
    }
}
