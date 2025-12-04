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
    private EmployeeRepo productRepo;

    public List<Employee> getAllEmployees(){
        return productRepo.findAll();
    }

    public Employee addEmployee(Employee employee, MultipartFile image) throws IOException{
        employee.setImageName(image.getOriginalFilename());
        employee.setImageType(image.getContentType());
        employee.setImageData(image.getBytes());
        return productRepo.save(employee);
    }
}
