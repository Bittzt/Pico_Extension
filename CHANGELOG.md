# Changelog

All notable changes to this project will be documented in this file.  
This project follows [Semantic Versioning](https://semver.org/).

---

## [0.0.5] - 2025-09-26
### Fixed
- ปรับปรุงระบบ **Lint** ให้ทำงานได้เสถียรขึ้น โดยแก้ไขปัญหา false error ที่ไม่ควรจะเกิด
- เพิ่มความแม่นยำของการตรวจ Front Matter, Heading และลิงก์

---

## [0.0.4] - 2025-09-23
### Changed
- ปรับปรุงและขยาย **Lint rules**:
  - ตรวจสอบ Front Matter ว่ามี `Title`, `Date`, `Template`, `Tags`
  - ตรวจสอบการเขียนหัวข้อ `#` ให้เว้นวรรคอย่างถูกต้อง
  - ตรวจสอบรูปแบบลิงก์ Markdown  
- เพิ่ม Quick Fix actions เช่น:
  - แทรก Front Matter อัตโนมัติ
  - ใส่ช่องว่างหลังเครื่องหมาย `#`
  - แก้ไขลิงก์ผิดรูปแบบ

---

## [0.0.3] - 2025-09-20
### Added
- ระบบ **Live Preview (Markdown)** ที่สมบูรณ์ สามารถ preview แบบ real-time ได้
- แถบ **Lint Status Bar** แสดงจำนวน error/warning ของไฟล์
- เริ่มต้นระบบ **Lint เบื้องต้น** สำหรับ Markdown และ Twig

---

## [0.0.2] - 2025-08-24
### Added
- ฟีเจอร์ **Autocomplete / Snippets**:
  - `pico-front` สำหรับ Markdown (Front Matter Template)
  - `twig-block` และ `twig-include` สำหรับ Twig
- ระบบ **Live Preview (Markdown)** เวอร์ชันเบื้องต้น

---

## [0.0.1] - 2025-08-10
### Added
- ฟีเจอร์ **สร้าง Markdown ใหม่** จาก Command Palette
- แทรก **Front Matter พื้นฐาน** (`Title`, `Date`, `Description`) อัตโนมัติเมื่อสร้างไฟล์ใหม่
