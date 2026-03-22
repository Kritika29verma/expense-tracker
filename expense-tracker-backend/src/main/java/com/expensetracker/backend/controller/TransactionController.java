package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.ApiResponse;
import com.expensetracker.backend.dto.TransactionRequest;
import com.expensetracker.backend.dto.TransactionResponse;
import com.expensetracker.backend.security.CustomUserDetails;
import com.expensetracker.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService service;

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> add(
            @Valid @RequestBody TransactionRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        TransactionResponse response = service.addTransaction(req, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Transaction added", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("date").descending());
        Page<TransactionResponse> transactions = service.getUserTransactions(userDetails.getUserId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> edit(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        TransactionResponse response = service.editTransaction(id, req, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Transaction updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        service.deleteTransaction(id, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted", null));
    }
}
