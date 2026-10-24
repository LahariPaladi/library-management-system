package com.example.library.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "loans")
public class Loan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name="book_id")
    private Book book;
    @ManyToOne(optional = false) @JoinColumn(name="member_id")
    private Member member;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status = "ACTIVE";
    public Loan() {}
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Book getBook(){return book;} public void setBook(Book book){this.book=book;}
    public Member getMember(){return member;} public void setMember(Member member){this.member=member;}
    public LocalDate getIssueDate(){return issueDate;} public void setIssueDate(LocalDate issueDate){this.issueDate=issueDate;}
    public LocalDate getDueDate(){return dueDate;} public void setDueDate(LocalDate dueDate){this.dueDate=dueDate;}
    public LocalDate getReturnDate(){return returnDate;} public void setReturnDate(LocalDate returnDate){this.returnDate=returnDate;}
    public String getStatus(){return status;} public void setStatus(String status){this.status=status;}
}
