package com.lavindu.employeeManagement.controller;

import com.lavindu.employeeManagement.model.Employee;
import com.lavindu.employeeManagement.service.EmployeeService;
import com.lavindu.employeeManagement.service.ReportService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;

import java.io.IOException;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;




@RestController
@RequestMapping("/api")
@CrossOrigin
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ReportService reportService;

    @GetMapping("/employees")
    public ResponseEntity <List<Employee>> getEmployees() {
        return new ResponseEntity<>(employeeService.getAllEmployees(), HttpStatus.ACCEPTED);
    }

    @PostMapping("/employee")
    public ResponseEntity<?> addEmployee(@Valid @RequestPart Employee employee, @RequestPart MultipartFile imageFile) {
        Employee newEmployee = null;
        try{
            newEmployee = employeeService.addEmployee(employee, imageFile);
        }catch(IOException e){
            return new ResponseEntity<>("Image upload failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(newEmployee, HttpStatus.CREATED);
    }

    @GetMapping("/employee/{empCode}/download/{format}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable String empCode, @PathVariable String format) {
        // Note: Ideally, implement getEmployeeByCode in EmployeeService. 
        // Here we filter from all employees as a fallback.
        Employee employee = employeeService.getAllEmployees().stream()
                .filter(e -> e.getEmpCode().equals(empCode))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Employee not found with code: " + empCode));

        byte[] data = null;
        String contentType = "";
        String extension = "";

        try {
            if ("pdf".equalsIgnoreCase(format)) {
                data = reportService.generatePdf(employee);
                contentType = MediaType.APPLICATION_PDF_VALUE;
                extension = "pdf";
            } else if ("excel".equalsIgnoreCase(format)) {
                data = reportService.generateExcel(employee);
                contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                extension = "xlsx";
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Employee_" + empCode + "." + extension)
                .contentType(MediaType.parseMediaType(contentType))
.body(data);
}
    
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Employee Management!";
    }
}
