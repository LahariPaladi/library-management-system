package com.example.library.controller;

import com.example.library.model.Member;
import com.example.library.repository.MemberRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/members")
public class MemberController {
    private final MemberRepository members;
    public MemberController(MemberRepository members){this.members=members;}
    @GetMapping public List<Member> all(){return members.findAll();}
    @GetMapping("/{id}") public Member one(@PathVariable Long id){
        return members.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Member not found"));
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Member create(@Valid @RequestBody Member m){m.setId(null);return members.save(m);}
    @PutMapping("/{id}") public Member update(@PathVariable Long id,@Valid @RequestBody Member input){
        Member m=one(id);m.setName(input.getName());m.setEmail(input.getEmail());m.setPhone(input.getPhone());return members.save(m);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){
        if(!members.existsById(id))throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Member not found");
        members.deleteById(id);
    }
}
