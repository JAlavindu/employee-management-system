package com.lavindu.employeeManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private long totalEmployees;
    private long activeEmployees;
    private long deactivatedEmployees;
}
