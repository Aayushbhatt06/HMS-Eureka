package com.aayush.HMS.service.impl;

import com.aayush.HMS.dto.request.PaymentVerifyRequest;
import com.aayush.HMS.dto.response.PaymentResponse;
import com.aayush.HMS.model.Bill;
import com.aayush.HMS.model.PaymentTransaction;
import com.aayush.HMS.model.enums.PaymentStatus;
import com.aayush.HMS.repository.BillRepository;
import com.aayush.HMS.repository.PaymentRepository;
import com.aayush.HMS.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public PaymentResponse createPaymentOrder(Long admissionId) {
        Bill bill = billRepository.findByAdmissionId(admissionId)
                .orElseThrow(() -> new RuntimeException("Discharged bill not found. Please discharge patient first to generate bill."));

        if (bill.getStatus() == PaymentStatus.COMPLETED) {
            throw new RuntimeException("Bill is already paid!");
        }

        double totalAmount = bill.getTotalAmount();
        long amountInPaise = Math.round(totalAmount * 100);

        String razorpayOrderId = null;

        try {
            if (keyId != null && !keyId.isEmpty() && !keyId.contains("fallbackKey")) {
                RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
                
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", "txn_" + bill.getId());
                
                Order order = razorpay.orders.create(orderRequest);
                razorpayOrderId = order.get("id");
            } else {
                logger.warn("Razorpay credentials are not configured or are defaults. Generating mock Order ID.");
                razorpayOrderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            }
        } catch (Exception e) {
            logger.error("Error creating Razorpay Order, falling back to mock Order ID.", e);
            razorpayOrderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        }

        PaymentResponse response = new PaymentResponse();
        response.setRazorpayOrderId(razorpayOrderId);
        response.setAmount(bill.getTotalAmount());
        response.setCurrency("INR");
        response.setKeyId(keyId);
        response.setBillId(bill.getId());

        PaymentTransaction tx = paymentRepository.findByBillId(bill.getId()).orElse(new PaymentTransaction());
        tx.setBill(bill);
        tx.setRazorpayOrderId(razorpayOrderId);
        tx.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(tx);

        return response;
    }

    @Override
    public boolean verifyPayment(PaymentVerifyRequest request) {
        PaymentTransaction tx = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Transaction record not found for Order ID: " + request.getRazorpayOrderId()));

        Bill bill = tx.getBill();
        boolean isValid = false;

        if (request.getRazorpayOrderId().startsWith("order_mock_")) {
            logger.info("Verifying mock payment for Order ID: {}", request.getRazorpayOrderId());
            isValid = true;
        } else {
            try {
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", request.getRazorpayOrderId());
                options.put("razorpay_payment_id", request.getRazorpayPaymentId());
                options.put("razorpay_signature", request.getRazorpaySignature());

                isValid = Utils.verifyPaymentSignature(options, keySecret);
            } catch (Exception e) {
                logger.error("Razorpay signature verification failed.", e);
                isValid = false;
            }
        }

        if (isValid) {
            tx.setRazorpayPaymentId(request.getRazorpayPaymentId());
            tx.setRazorpaySignature(request.getRazorpaySignature());
            tx.setStatus(PaymentStatus.COMPLETED);
            tx.setPaymentDate(LocalDateTime.now());
            paymentRepository.save(tx);

            bill.setStatus(PaymentStatus.COMPLETED);
            billRepository.save(bill);

            return true;
        } else {
            tx.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(tx);
            return false;
        }
    }
}
