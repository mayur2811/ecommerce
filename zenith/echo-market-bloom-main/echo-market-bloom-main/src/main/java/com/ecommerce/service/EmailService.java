
package com.ecommerce.service;

import java.util.Map;

import jakarta.mail.MessagingException;

public interface EmailService {
    
    void sendSimpleEmail(String to, String subject, String body);
    
    void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException;
    
    void sendTemplatedEmail(String to, String subject, String templateName, Map<String, Object> templateModel) throws MessagingException;
}
