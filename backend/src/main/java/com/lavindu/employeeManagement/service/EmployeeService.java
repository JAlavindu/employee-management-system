package com.lavindu.employeeManagement.service;


import com.lavindu.employeeManagement.model.Employee;
import com.lavindu.employeeManagement.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepo employeeRepo;

    public List<Employee> getAllEmployees(){
        return employeeRepo.findAll();
    }

    public Employee addEmployee(Employee employee, MultipartFile image) throws IOException{
        String nextEmpCode = generateNextEmpCode();
        employee.setEmpCode(nextEmpCode);
        employee.setImageName(image.getOriginalFilename());
        employee.setImageType(image.getContentType());
        employee.setImageData(image.getBytes());
        return employeeRepo.save(employee);
    }

    private String generateNextEmpCode() {
        String lastCode = employeeRepo.findLastEmpCode();
        
        if (lastCode == null || lastCode.isEmpty()) {
            return "EMP001"; // First employee
        }

        try {
            // Check if the code follows the standard length (EMP + 3 digits = 6 chars)
            if (lastCode.length() < 4 || !lastCode.startsWith("EMP")) {
                 // If we have old data like "1" or "2", we can either:
                 // 1. Start over from EMP001 (risk of duplicate if EMP001 exists?)
                 // 2. Try to parse the number and convert it.
                 // Let's try to parse the number if it's just digits
                 try {
                     int oldId = Integer.parseInt(lastCode);
                     return String.format("EMP%03d", oldId + 1);
                 } catch (NumberFormatException ex) {
                     return "EMP001"; // Fallback
                 }
            }

            // Extract the number part (remove "EMP")
            String numericPart = lastCode.substring(3); 
            int id = Integer.parseInt(numericPart);
            
            // Increment and format back to EMP + 3 digits (e.g., 1 -> "001")
            return String.format("EMP%03d", id + 1);
        } catch (Exception e) {
            // Fallback for any other errors
            return "EMP001"; 
        }
    }
}