package com.expensetracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryAnalyticsResponse {
    private String categoryName;
    private double total;
    private double percentage;
}
