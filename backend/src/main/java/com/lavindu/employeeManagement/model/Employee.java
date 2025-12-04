package com.lavindu.employeeManagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empCode;
    private String firstName;
    private String lastName;
    private String address;
    private String NIC;
    private String mobileNo;
    private String gender;
    private String email;
    private String designation;
    private String status;
    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;
}
