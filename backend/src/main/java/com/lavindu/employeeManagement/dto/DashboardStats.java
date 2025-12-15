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

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getActiveEmployees() {
        return activeEmployees;
    }

    public void setActiveEmployees(long activeEmployees) {
        this.activeEmployees = activeEmployees;
    }

    public long getDeactivatedEmployees() {
        return deactivatedEmployees;
    }

    public void setDeactivatedEmployees(long deactivatedEmployees) {
        this.deactivatedEmployees = deactivatedEmployees;
    }
}
