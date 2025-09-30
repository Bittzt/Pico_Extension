# Pico Helper

> VS Code extension โดย **Bittzt (Boo)** สำหรับช่วยสร้างคอนเทนต์และธีมของ **Pico CMS**  
> รองรับ Markdown + Twig พร้อม Lint, Live Preview, Snippet/Autocomplete และ Quick Fix

---

## ✨ Features

- **Create Markdown (พร้อม Front Matter)**  
  คำสั่ง `Pico CMS: สร้าง Markdown ใหม่` สร้างไฟล์ `.md` ที่มี Front Matter มาตรฐาน (`Title`, `Date`, `Description`, `Template`, `Tags`)  
  • ถ้ามีไฟล์ชื่อซ้ำ: จะแสดง **ยืนยันเขียนทับ** ก่อนเสมอ  
  • สร้างเสร็จ: เปิดไฟล์ + โชว์ใน Explorer + เปิด Live Preview ให้อัตโนมัติ

- **Live Preview (Markdown)**  
  แสดงผล Markdown ข้าง ๆ editor และอัปเดตแบบสด (`Ctrl+Alt+V`)

- **Lint + Status Bar + Quick Fix**  
  • ตรวจ Markdown:  
  – Front Matter ว่าง/หาย  
  – `Date` ต้องเป็น `YYYY-MM-DD`  
  – `Template` แนะนำให้ใส่ (Hint)  
  – `Tags` ควรเป็น `[tag1, tag2]`  
  – หัวข้อแบบ `#About` → ต้องเว้นวรรคเป็น `# About`  
  – ลิงก์ผิดรูปแบบ `[text]www.example.com` → ควรเป็น `[text](url)`  
  • ตรวจ Twig:  
  – `include` ต้องลงท้าย `.twig`  
  – เช็คคู่ `if/for/block` ↔ `endif/endfor/endblock`  
  • แถบสถานะ (ซ้ายล่าง) แสดงจำนวนปัญหา กดเพื่อเปิด Problems Panel ได้  
  • **Quick Fix (`CTRL+.`)**:  
  – เพิ่ม Front Matter อัตโนมัติ  
  – ใส่ช่องว่างหลัง `#` ให้อัตโนมัติ  
  – ครอบลิงก์ให้เป็น `[text](https://url)`

- **Snippets & Autocomplete**  
  • Markdown → `pico-front` (Front Matter ครบชุด)  
  • Twig → `twig-block`, `twig-include`

---

## 🧭 Commands & Keybindings

| Command | Title | Keybinding |
|---|---|---|
| `pico-helper.createMarkdown` | Pico CMS: สร้าง Markdown ใหม่ | – |
| `pico-helper.preview` | Pico: Live Preview (Markdown) | `Ctrl+Alt+V` / `Cmd+Alt+V` |
| `pico-helper.lintFile` | Pico: Lint/ตรวจสอบไฟล์ปัจจุบัน | `Ctrl+Alt+L` / `Cmd+Alt+L` |
| `pico-helper.helloWorld` | Hello World | – |

---

## 🖼️ Screenshots

![Create Markdown](images/create-md.png)  
![Live Preview](images/preview-markdown.png)  
![Lint Status Bar](images/statusbar-lint.png)  
![Quick Fix](images/quickfix-front-matter.gif)

---

## ⚙️ Requirements

- VS Code **1.102.0** ขึ้นไป  
- (ถ้าพัฒนาต่อ) ต้องมี Node.js + npm

---

## 🔧 Extension Settings / Defaults

ส่วนขยายนี้ตั้งค่าเริ่มต้นให้ **Markdown** และ **Twig** ดังนี้:
- `editor.snippetSuggestions: "top"`
- เปิด `suggestOnTriggerCharacters` และ `quickSuggestions`
- ปิด `wordBasedSuggestions`

---

## 🐞 Known Issues

- Lint Front Matter ยังเป็นแบบเบื้องต้น (YAML ซับซ้อนมาก ๆ อาจแจ้งเตือนไม่ครบ)
- ยังไม่พรีวิว Twig/ธีม Pico ทั้งชุด (อยู่ใน Roadmap)

---

## 🗺️ Roadmap

- เพิ่ม Quick Fix สำหรับ `Date`, `Tags`, และการเคาะบรรทัดรอบหัวข้อ
- พรีวิว Twig + Theme (อ่านไฟล์ในโฟลเดอร์ theme)
- ตัวเลือกเปิด/ปิดกฎ Lint รายข้อจาก Settings

---

## 📝 Release Notes

### 0.0.5
- ปรับปรุง **Lint** ให้ทำงานได้เสถียร ลด false error/warning  
- ตรวจสอบ Front Matter + Markdown + Twig ครบโดยไม่เจอ Error ที่ไม่ควรมี  

### 0.0.4
- ขยายกฎ **Lint** ครอบคลุม:  
  – Date format (YYYY-MM-DD)  
  – Template แนะนำให้ใส่  
  – Tags ต้องอยู่ใน `[]`  
  – จับ error เมื่อ key ใน Front Matter ไม่ตามด้วย `:`  
  – Twig include ลงท้าย `.twig` + ตรวจคู่ block/if/for  

### 0.0.3
- **Live Preview (Markdown)** เสร็จสมบูรณ์  
- เพิ่ม **Lint เริ่มต้น** (Front Matter / Heading / Links / Twig basic)  
- เพิ่ม **Status Bar Lint** + ปุ่มเปิด Problems  
- เพิ่ม **Quick Fix** (Front Matter / # heading space / Markdown link)  

### 0.0.2
- เพิ่ม **Autocomplete / Snippets**  
  – Markdown: `pico-front`  
  – Twig: `twig-block`, `twig-include`  
- Live Preview เวอร์ชันแรก (เบื้องต้น)  

### 0.0.1
- ฟีเจอร์เริ่มต้น: **Create Markdown + Front Matter**  
- คำสั่ง `pico-helper.createMarkdown` พร้อมสร้างไฟล์ใหม่อัตโนมัติ  

---

## 📖 More Info

- [Pico CMS Docs](https://picocms.org/docs)  
- [VS Code Extension API](https://code.visualstudio.com/api)

---

**ขอให้สนุกกับการทำคอนเทนต์บน Pico CMS ด้วย VS Code! 🚀**
