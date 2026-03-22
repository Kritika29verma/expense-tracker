package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.*;
import com.expensetracker.backend.entity.Category;
import com.expensetracker.backend.entity.Transaction;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.exception.BadRequestException;
import com.expensetracker.backend.exception.ResourceNotFoundException;
import com.expensetracker.backend.repository.CategoryRepository;
import com.expensetracker.backend.repository.TransactionRepository;
import com.expensetracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired private TransactionRepository transactionRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private UserRepository userRepository;

    public TransactionResponse addTransaction(TransactionRequest req, Long userId) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(userId)) {
            throw new BadRequestException("Category does not belong to user");
        }

        User user = userRepository.getReferenceById(userId);

        Transaction t = new Transaction();
        t.setAmount(req.getAmount());
        t.setType(req.getType());
        t.setCategory(category);
        t.setUser(user);
        t.setDate(req.getDate());
        t.setNote(req.getNote());

        return TransactionResponse.from(transactionRepository.save(t));
    }

    public TransactionResponse editTransaction(Long id, TransactionRequest req, Long userId) {
        Transaction t = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!t.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied");
        }

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(userId)) {
            throw new BadRequestException("Category does not belong to user");
        }

        t.setAmount(req.getAmount());
        t.setType(req.getType());
        t.setCategory(category);
        t.setDate(req.getDate());
        t.setNote(req.getNote());

        return TransactionResponse.from(transactionRepository.save(t));
    }

    public void deleteTransaction(Long id, Long userId) {
        Transaction t = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!t.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied");
        }

        transactionRepository.delete(t);
    }

    public Page<TransactionResponse> getUserTransactions(Long userId, Pageable pageable) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId, pageable)
                .map(TransactionResponse::from);
    }

    public MonthlySummaryResponse getMonthlySummary(Long userId, int month, int year) {
        double income = transactionRepository.sumIncomeByUserAndMonth(userId, month, year);
        double expense = transactionRepository.sumExpenseByUserAndMonth(userId, month, year);
        return new MonthlySummaryResponse(income, expense, income - expense, month, year);
    }

    public List<CategoryAnalyticsResponse> getCategoryAnalytics(Long userId, int month, int year) {
        List<Object[]> rows = transactionRepository.categoryAnalyticsByMonth(userId, month, year);
        double total = rows.stream().mapToDouble(r -> ((Number) r[1]).doubleValue()).sum();

        return rows.stream().map(r -> {
            String name = (String) r[0];
            double amount = ((Number) r[1]).doubleValue();
            double pct = total > 0 ? Math.round((amount / total) * 1000.0) / 10.0 : 0;
            return new CategoryAnalyticsResponse(name, amount, pct);
        }).collect(Collectors.toList());
    }
}
