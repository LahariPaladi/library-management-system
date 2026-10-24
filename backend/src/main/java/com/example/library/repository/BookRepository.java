package com.example.library.repository;
import com.example.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("select b from Book b where lower(b.title) like lower(concat('%', :q, '%')) or lower(b.author) like lower(concat('%', :q, '%')) or lower(coalesce(b.isbn,'')) like lower(concat('%', :q, '%'))")
    List<Book> search(@Param("q") String q);
}
