package com.expensetracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private int month;
    private int year;
    private double limitAmount;
    private double spent;
    private double percentUsed;
    private String alertLevel; // "SAFE", "WARNING" (>=80%), "EXCEEDED" (>=100%)
}
