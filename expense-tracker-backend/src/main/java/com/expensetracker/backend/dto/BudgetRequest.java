package com.expensetracker.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BudgetRequest {

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Month is required")
    @Min(value = 1)
    private Integer month;

    @NotNull(message = "Year is required")
    @Min(value = 2000)
    private Integer year;

    @NotNull(message = "Limit amount is required")
    @Min(value = 1, message = "Limit must be greater than 0")
    private Double limitAmount;
}
