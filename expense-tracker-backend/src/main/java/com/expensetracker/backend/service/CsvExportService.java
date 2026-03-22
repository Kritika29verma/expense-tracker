package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Transaction;
import com.expensetracker.backend.repository.TransactionRepository;
import com.opencsv.CSVWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class CsvExportService {

    @Autowired
    private TransactionRepository transactionRepository;

    public byte[] exportMonthlyTransactions(Long userId, int month, int year) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);

        List<Transaction> filtered = transactions.stream()
                .filter(t -> t.getDate().getMonthValue() == month && t.getDate().getYear() == year)
                .toList();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             CSVWriter writer = new CSVWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8))) {

            writer.writeNext(new String[]{"ID", "Date", "Type", "Category", "Amount", "Note"});

            for (Transaction t : filtered) {
                writer.writeNext(new String[]{
                        String.valueOf(t.getId()),
                        t.getDate().toString(),
                        t.getType().name(),
                        t.getCategory().getName(),
                        String.valueOf(t.getAmount()),
                        t.getNote() != null ? t.getNote() : ""
                });
            }

            writer.flush();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate CSV: " + e.getMessage());
        }
    }
}
