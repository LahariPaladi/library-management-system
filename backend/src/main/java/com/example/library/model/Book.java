package com.example.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "books")
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank private String title;
    @NotBlank private String author;
    private String isbn;
    private String category;
    @NotNull @Min(0) private Integer totalCopies = 1;
    @NotNull @Min(0) private Integer availableCopies = 1;

    public Book() {}
    public Book(String title, String author, String isbn, String category, Integer totalCopies, Integer availableCopies) {
        this.title=title; this.author=author; this.isbn=isbn; this.category=category;
        this.totalCopies=totalCopies; this.availableCopies=availableCopies;
    }
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String title){this.title=title;}
    public String getAuthor(){return author;} public void setAuthor(String author){this.author=author;}
    public String getIsbn(){return isbn;} public void setIsbn(String isbn){this.isbn=isbn;}
    public String getCategory(){return category;} public void setCategory(String category){this.category=category;}
    public Integer getTotalCopies(){return totalCopies;} public void setTotalCopies(Integer totalCopies){this.totalCopies=totalCopies;}
    public Integer getAvailableCopies(){return availableCopies;} public void setAvailableCopies(Integer availableCopies){this.availableCopies=availableCopies;}
}
