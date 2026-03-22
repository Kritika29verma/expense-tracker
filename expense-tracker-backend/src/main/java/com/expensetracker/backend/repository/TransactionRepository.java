package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByUserIdOrderByDateDesc(Long userId, Pageable pageable);

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'INCOME' " +
           "AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    Double sumIncomeByUserAndMonth(@Param("userId") Long userId,
                                   @Param("month") int month,
                                   @Param("year") int year);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'EXPENSE' " +
           "AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    Double sumExpenseByUserAndMonth(@Param("userId") Long userId,
                                    @Param("month") int month,
                                    @Param("year") int year);

    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'EXPENSE' " +
           "AND MONTH(t.date) = :month AND YEAR(t.date) = :year " +
           "GROUP BY t.category.name")
    List<Object[]> categoryAnalyticsByMonth(@Param("userId") Long userId,
                                             @Param("month") int month,
                                             @Param("year") int year);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.category.id = :categoryId AND t.type = 'EXPENSE' " +
           "AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    Double sumExpenseByCategoryAndMonth(@Param("userId") Long userId,
                                        @Param("categoryId") Long categoryId,
                                        @Param("month") int month,
                                        @Param("year") int year);
}
