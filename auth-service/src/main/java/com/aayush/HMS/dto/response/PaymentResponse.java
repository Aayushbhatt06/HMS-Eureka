package com.aayush.HMS.dto.response;

public class PaymentResponse {
    private String razorpayOrderId;
    private Double amount;
    private String currency;
    private String keyId;
    private Long billId;

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
    public Long getBillId() { return billId; }
    public void setBillId(Long billId) { this.billId = billId; }
}
