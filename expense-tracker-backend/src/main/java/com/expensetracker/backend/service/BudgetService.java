package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.BudgetRequest;
import com.expensetracker.backend.dto.BudgetResponse;
import com.expensetracker.backend.entity.Budget;
import com.expensetracker.backend.entity.Category;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.exception.BadRequestException;
import com.expensetracker.backend.exception.ResourceNotFoundException;
import com.expensetracker.backend.repository.BudgetRepository;
import com.expensetracker.backend.repository.CategoryRepository;
import com.expensetracker.backend.repository.TransactionRepository;
import com.expensetracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired private BudgetRepository budgetRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;

    public BudgetResponse setBudget(BudgetRequest req, Long userId) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(userId)) {
            throw new BadRequestException("Category does not belong to user");
        }

        Optional<Budget> existing = budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(
                userId, req.getCategoryId(), req.getMonth(), req.getYear());

        Budget budget = existing.orElse(new Budget());
        if (budget.getId() == null) {
            budget.setUser(userRepository.getReferenceById(userId));
            budget.setCategory(category);
            budget.setMonth(req.getMonth());
            budget.setYear(req.getYear());
        }
        budget.setLimitAmount(req.getLimitAmount());

        budgetRepository.save(budget);
        return buildBudgetResponse(budget, userId);
    }

    public List<BudgetResponse> getUserBudgets(Long userId, int month, int year) {
        return budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .stream()
                .map(b -> buildBudgetResponse(b, userId))
                .collect(Collectors.toList());
    }

    public void deleteBudget(Long id, Long userId) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied");
        }

        budgetRepository.delete(budget);
    }

    private BudgetResponse buildBudgetResponse(Budget b, Long userId) {
        double spent = transactionRepository.sumExpenseByCategoryAndMonth(
                userId, b.getCategory().getId(), b.getMonth(), b.getYear());

        double pct = b.getLimitAmount() > 0 ? Math.round((spent / b.getLimitAmount()) * 1000.0) / 10.0 : 0;

        String alertLevel;
        if (pct >= 100) alertLevel = "EXCEEDED";
        else if (pct >= 80) alertLevel = "WARNING";
        else alertLevel = "SAFE";

        return new BudgetResponse(
                b.getId(),
                b.getCategory().getId(),
                b.getCategory().getName(),
                b.getMonth(),
                b.getYear(),
                b.getLimitAmount(),
                spent,
                pct,
                alertLevel
        );
    }
}
