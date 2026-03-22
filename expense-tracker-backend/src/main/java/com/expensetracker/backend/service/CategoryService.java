package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.CategoryRequest;
import com.expensetracker.backend.dto.CategoryResponse;
import com.expensetracker.backend.entity.Category;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.exception.BadRequestException;
import com.expensetracker.backend.repository.CategoryRepository;
import com.expensetracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired private CategoryRepository categoryRepository;
    @Autowired private UserRepository userRepository;

    public List<CategoryResponse> getUserCategories(Long userId) {
        return categoryRepository.findByUserId(userId)
                .stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }

    public CategoryResponse createCategory(CategoryRequest req, Long userId) {
        categoryRepository.findByNameAndUserId(req.getName(), userId).ifPresent(c -> {
            throw new BadRequestException("Category '" + req.getName() + "' already exists");
        });

        User user = userRepository.getReferenceById(userId);
        Category cat = new Category();
        cat.setName(req.getName());
        cat.setUser(user);
        return CategoryResponse.from(categoryRepository.save(cat));
    }
}
