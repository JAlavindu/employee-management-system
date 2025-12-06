package com.lavindu.employeeManagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
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
    @NotBlank(message = "Employee Code is required")
    private String empCode;

    @NotBlank(message = "First Name is required")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    private String lastName;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "NIC is required")
    private String NIC; // Ensure this matches your getter/setter naming

    @NotBlank(message = "Mobile Number is required")
    private String mobileNo;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Date of Birth is required")
    private String dob;

    private String imageName;
    private String imageType;

    @Lob
    @Column(length = 10000000)
    private byte[] imageData;
}
