package com.lavindu.employeeManagement.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Font;
import com.lavindu.employeeManagement.model.Employee;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.stream.Stream;

@Service
public class ReportService {

    public byte[] generatePdf(Employee employee) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Employee Details Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        // Table
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addPdfRow(table, "Employee Code", employee.getEmpCode());
        addPdfRow(table, "First Name", employee.getFirstName());
        addPdfRow(table, "Last Name", employee.getLastName());
        addPdfRow(table, "NIC", employee.getNIC());
        addPdfRow(table, "Designation", employee.getDesignation());
        addPdfRow(table, "Email", employee.getEmail());
        addPdfRow(table, "Mobile No", employee.getMobileNo());
        addPdfRow(table, "Gender", employee.getGender());
        addPdfRow(table, "Date of Birth", String.valueOf(employee.getDob()));
        addPdfRow(table, "Address", employee.getAddress());
        addPdfRow(table, "Status", employee.getStatus());

        document.add(table);
        document.close();

        return out.toByteArray();
    }

    private void addPdfRow(PdfPTable table, String header, String value) {
        PdfPCell headerCell = new PdfPCell(new Phrase(header));
        headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell.setPadding(5);
        table.addCell(headerCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "N/A"));
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }

    public byte[] generateExcel(Employee employee) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Employee Details");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            int rowIdx = 0;
            addExcelRow(sheet, rowIdx++, headerStyle, "Field", "Value");
            addExcelRow(sheet, rowIdx++, null, "Employee Code", employee.getEmpCode());
            addExcelRow(sheet, rowIdx++, null, "First Name", employee.getFirstName());
            addExcelRow(sheet, rowIdx++, null, "Last Name", employee.getLastName());
            addExcelRow(sheet, rowIdx++, null, "NIC", employee.getNIC());
            addExcelRow(sheet, rowIdx++, null, "Designation", employee.getDesignation());
            addExcelRow(sheet, rowIdx++, null, "Email", employee.getEmail());
            addExcelRow(sheet, rowIdx++, null, "Mobile No", employee.getMobileNo());
            addExcelRow(sheet, rowIdx++, null, "Gender", employee.getGender());
            addExcelRow(sheet, rowIdx++, null, "Date of Birth", String.valueOf(employee.getDob()));
            addExcelRow(sheet, rowIdx++, null, "Address", employee.getAddress());
            addExcelRow(sheet, rowIdx++, null, "Status", employee.getStatus());

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void addExcelRow(Sheet sheet, int rowIdx, CellStyle style, String field, String value) {
        Row row = sheet.createRow(rowIdx);
        Cell cell0 = row.createCell(0);
        cell0.setCellValue(field);
        if (style != null) cell0.setCellStyle(style);

        Cell cell1 = row.createCell(1);
        cell1.setCellValue(value != null ? value : "N/A");
        if (style != null) cell1.setCellStyle(style);
    }
}