package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.ApiResponse;
import com.expensetracker.backend.dto.CategoryAnalyticsResponse;
import com.expensetracker.backend.dto.MonthlySummaryResponse;
import com.expensetracker.backend.security.CustomUserDetails;
import com.expensetracker.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<MonthlySummaryResponse>> getMonthlySummary(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year != null) ? year : LocalDate.now().getYear();

        MonthlySummaryResponse summary = transactionService.getMonthlySummary(userDetails.getUserId(), m, y);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryAnalyticsResponse>>> getCategoryAnalytics(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year != null) ? year : LocalDate.now().getYear();

        List<CategoryAnalyticsResponse> analytics = transactionService.getCategoryAnalytics(userDetails.getUserId(), m, y);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
