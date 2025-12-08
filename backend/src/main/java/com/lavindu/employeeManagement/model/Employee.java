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


    public @NotBlank(message = "Employee Code is required") String getEmpCode() {
        return empCode;
    }

    public @NotBlank(message = "First Name is required") String getFirstName() {
        return firstName;
    }

    public @NotBlank(message = "Last Name is required") String getLastName() {
        return lastName;
    }

    public @NotBlank(message = "Address is required") String getAddress() {
        return address;
    }

    public @NotBlank(message = "NIC is required") String getNIC() {
        return NIC;
    }

    public @NotBlank(message = "Mobile Number is required") String getMobileNo() {
        return mobileNo;
    }

    public @NotBlank(message = "Gender is required") String getGender() {
        return gender;
    }

    public @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String getEmail() {
        return email;
    }

    public @NotBlank(message = "Designation is required") String getDesignation() {
        return designation;
    }

    public @NotBlank(message = "Status is required") String getStatus() {
        return status;
    }

    public @NotBlank(message = "Date of Birth is required") String getDob() {
        return dob;
    }

    public String getImageName() {
        return imageName;
    }

    public String getImageType() {
        return imageType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setEmpCode(@NotBlank(message = "Employee Code is required") String empCode) {
        this.empCode = empCode;
    }

    public void setFirstName(@NotBlank(message = "First Name is required") String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(@NotBlank(message = "Last Name is required") String lastName) {
        this.lastName = lastName;
    }

    public void setAddress(@NotBlank(message = "Address is required") String address) {
        this.address = address;
    }

    public void setNIC(@NotBlank(message = "NIC is required") String NIC) {
        this.NIC = NIC;
    }

    public void setMobileNo(@NotBlank(message = "Mobile Number is required") String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public void setGender(@NotBlank(message = "Gender is required") String gender) {
        this.gender = gender;
    }

    public void setEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email) {
        this.email = email;
    }

    public void setDesignation(@NotBlank(message = "Designation is required") String designation) {
        this.designation = designation;
    }

    public void setStatus(@NotBlank(message = "Status is required") String status) {
        this.status = status;
    }

    public void setDob(@NotBlank(message = "Date of Birth is required") String dob) {
        this.dob = dob;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
}
