package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.ApiResponse;
import com.expensetracker.backend.dto.BudgetRequest;
import com.expensetracker.backend.dto.BudgetResponse;
import com.expensetracker.backend.security.CustomUserDetails;
import com.expensetracker.backend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgets(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year != null) ? year : LocalDate.now().getYear();

        List<BudgetResponse> budgets = budgetService.getUserBudgets(userDetails.getUserId(), m, y);
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> setBudget(
            @Valid @RequestBody BudgetRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        BudgetResponse response = budgetService.setBudget(req, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Budget set", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        budgetService.deleteBudget(id, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Budget deleted", null));
    }
}
