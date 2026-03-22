package com.expensetracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlySummaryResponse {
    private double totalIncome;
    private double totalExpense;
    private double balance;
    private int month;
    private int year;
}
