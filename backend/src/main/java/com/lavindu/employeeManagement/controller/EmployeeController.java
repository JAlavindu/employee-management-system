package com.lavindu.employeeManagement.controller;

import com.lavindu.employeeManagement.model.Employee;
import com.lavindu.employeeManagement.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/employees")
    public ResponseEntity <List<Employee>> getEmployees() {
        return new ResponseEntity<>(employeeService.getAllEmployees(), HttpStatus.ACCEPTED);
    }

    @PostMapping("/employee")
    public ResponseEntity<?> addEmployee(@RequestPart Employee employee, @RequestPart MultipartFile imageFile) {
        Employee newEmployee = null;
        try{
            newEmployee = employeeService.addEmployee(employee, imageFile);
        }catch(IOException e){
            return new ResponseEntity<>("Image upload failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(newEmployee, HttpStatus.CREATED);
    }
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Employee Management!";
    }
}
