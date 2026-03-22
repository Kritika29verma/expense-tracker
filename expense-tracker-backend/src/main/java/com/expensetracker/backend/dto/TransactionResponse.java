package com.expensetracker.backend.dto;

import com.expensetracker.backend.entity.Transaction;
import com.expensetracker.backend.entity.TransactionType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TransactionResponse {
    private Long id;
    private Double amount;
    private TransactionType type;
    private Long categoryId;
    private String categoryName;
    private LocalDate date;
    private String note;

    public static TransactionResponse from(Transaction t) {
        TransactionResponse r = new TransactionResponse();
        r.setId(t.getId());
        r.setAmount(t.getAmount());
        r.setType(t.getType());
        r.setCategoryId(t.getCategory().getId());
        r.setCategoryName(t.getCategory().getName());
        r.setDate(t.getDate());
        r.setNote(t.getNote());
        return r;
    }
}
