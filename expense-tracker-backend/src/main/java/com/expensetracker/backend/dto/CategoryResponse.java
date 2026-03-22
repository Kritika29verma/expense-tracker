package com.expensetracker.backend.dto;

import com.expensetracker.backend.entity.Category;
import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;
    private String name;

    public static CategoryResponse from(Category c) {
        CategoryResponse r = new CategoryResponse();
        r.setId(c.getId());
        r.setName(c.getName());
        return r;
    }
}
