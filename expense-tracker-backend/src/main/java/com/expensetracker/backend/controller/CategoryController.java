package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.ApiResponse;
import com.expensetracker.backend.dto.CategoryRequest;
import com.expensetracker.backend.dto.CategoryResponse;
import com.expensetracker.backend.security.CustomUserDetails;
import com.expensetracker.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAll(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<CategoryResponse> categories = categoryService.getUserCategories(userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> create(
            @Valid @RequestBody CategoryRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        CategoryResponse response = categoryService.createCategory(req, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Category created", response));
    }
}
