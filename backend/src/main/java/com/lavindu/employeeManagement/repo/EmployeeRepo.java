package com.lavindu.employeeManagement.repo;

import com.lavindu.employeeManagement.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {
    @Query(value = "SELECT emp_code FROM employees ORDER BY emp_code DESC LIMIT 1", nativeQuery = true)
    String findLastEmpCode();
}
