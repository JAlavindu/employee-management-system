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
            // Extract the number part (remove "EMP")
            String numericPart = lastCode.substring(3); 
            int id = Integer.parseInt(numericPart);
            
            // Increment and format back to EMP + 3 digits (e.g., 1 -> "001")
            return String.format("EMP%03d", id + 1);
        } catch (NumberFormatException e) {
            // Fallback if database has bad data like "1" or "test"
            return "EMP001"; 
        }
    }
}