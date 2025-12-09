package com.lavindu.employeeManagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DashboardStats {
    private long totalEmployees;
    private long activeEmployees;
    private long deactivatedEmployees;

    // Explicit constructor in case Lombok annotation processing isn't available
    public DashboardStats(long totalEmployees, long activeEmployees, long deactivatedEmployees) {
        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.deactivatedEmployees = deactivatedEmployees;
    }
}
