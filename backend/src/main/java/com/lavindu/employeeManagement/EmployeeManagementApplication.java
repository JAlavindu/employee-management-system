package com.lavindu.employeeManagement;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class EmployeeManagementApplication {

    public static void main(String[] args) {
        loadEnv();
        SpringApplication.run(EmployeeManagementApplication.class, args);
    }

    private static void loadEnv() {
        // Try to find .env in the current directory or in the backend directory
        String[] paths = {".", "./backend"};
        for (String path : paths) {
            File envFile = new File(path, ".env");
            if (envFile.exists()) {
                Dotenv dotenv = Dotenv.configure()
                        .directory(path)
                        .ignoreIfMissing()
                        .load();
                dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
                System.out.println("Loaded environment variables from: " + envFile.getAbsolutePath());
                return;
            }
        }
        System.out.println(".env file not found in checked paths. Relying on existing environment variables.");
    }

}
