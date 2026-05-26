package com.aayush.HMS.repository;

import com.aayush.HMS.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByBillId(Long billId);
    Optional<PaymentTransaction> findByRazorpayOrderId(String razorpayOrderId);
}
