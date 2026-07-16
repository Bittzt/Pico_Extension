// ===============================
// VS Code API + Node modules
// ===============================
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

console.log("=== pico-helper extension.ts LOADED ===");

class PicoSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "pico-helper-sidebar";

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    console.log("🔍 resolveWebviewView called for", webviewView.viewType);
    console.log("📋 View type matches:", webviewView.viewType === PicoSidebarProvider.viewType);
    
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'images')]
    };

    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage((message) => {
      console.log("📨 Received message:", message);
      switch (message.command) {
        case "createMarkdown":
          vscode.commands.executeCommand("pico-helper.createMarkdown");
          break;
        case "preview":
          vscode.commands.executeCommand("pico-helper.preview");
          break;
        case "lint":
          vscode.commands.executeCommand("pico-helper.lintFile");
          break;
        case "login":
          vscode.commands.executeCommand("pico-helper.login");
          break;
        case "register":
          vscode.commands.executeCommand("pico-helper.register");
          break;
        case "forgot":
          vscode.commands.executeCommand("pico-helper.forgot");
          break;
        case "contact":
          vscode.commands.executeCommand("pico-helper.contact");
          break;
        case "profile":
          vscode.commands.executeCommand("pico-helper.profile");
          break;
        case "logout":
          vscode.commands.executeCommand("pico-helper.logout");
          break;
        case "plugin":
          vscode.commands.executeCommand("pico-helper.plugin");
          break;
        case "layout":
          vscode.commands.executeCommand("pico-helper.layout");
          break;
        case "nav":
          vscode.commands.executeCommand("pico-helper.nav");
          break;
        case "pagelist":
          vscode.commands.executeCommand("pico-helper.pagelist");
          break;
        case "theme":
          vscode.commands.executeCommand("pico-helper.theme");
          break;
        case "page":
          vscode.commands.executeCommand("pico-helper.page");
          break;
        case "blog":
          vscode.commands.executeCommand("pico-helper.blog");
          break;
        case "markdownSnippets":
          vscode.commands.executeCommand("pico-helper.openMarkdownSnippets");
          break;
        case "twigSnippets":
          vscode.commands.executeCommand("pico-helper.openTwigSnippets");
          break;
        case "phpSnippets":
          vscode.commands.executeCommand("pico-helper.openPhpSnippets");
          break;
      }
    });
    
    console.log("✅ Webview view resolved successfully");
  }

  private getHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: var(--vscode-font-family, sans-serif);
            font-size: var(--vscode-font-size, 13px);
            color: var(--vscode-foreground);
            background: var(--vscode-sideBar-background);
            padding: 10px;
          }
          .note {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 10px;
            line-height: 1.4;
          }
          .section-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--vscode-descriptionForeground);
            padding: 8px 0 4px;
          }
          .btn-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
            margin-bottom: 12px;
          }
          button {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 10px;
            background: var(--vscode-button-secondaryBackground, transparent);
            color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
            border: 1px solid var(--vscode-button-border, rgba(128,128,128,0.2));
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            text-align: left;
            width: 100%;
            transition: background 0.15s ease;
          }
          button:hover { background: var(--vscode-list-hoverBackground); }
          button .icon { font-size: 14px; }
          button .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .wide { grid-column: span 2; }
          .divider {
            border: none;
            border-top: 1px solid var(--vscode-sideBarSectionHeader-border, rgba(128,128,128,0.2));
            margin: 8px 0;
          }
        </style>
      </head>
      <body>

        <div class="note">
          คลิกปุ่มเพื่อแทรก template/snippet อัตโนมัติ หรือพิมพ์ prefix ในไฟล์ Markdown/Twig/PHP เพื่อใช้ snippet ได้ทันที เช่น <strong>!page</strong>, <strong>!layout</strong>, <strong>!plugin</strong>.
        </div>

        <div class="section-label">Quick Start</div>
        <div class="btn-grid">
          <button onclick="send('createMarkdown')"><span class="icon">📄</span><span class="label">Create new Markdown</span></button>
          <button onclick="send('preview')"><span class="icon">👁</span><span class="label">Live preview</span></button>
          <button onclick="send('lint')"><span class="icon">✅</span><span class="label">Lint current file</span></button>
        </div>

        <hr class="divider"/>

        <div class="section-label">Content Snippets</div>
        <div class="btn-grid">
          <button onclick="send('page')"><span class="icon">📃</span><span class="label">!page</span></button>
          <button onclick="send('blog')"><span class="icon">✍️</span><span class="label">!blog</span></button>
          <button class="wide" onclick="send('markdownSnippets')"><span class="icon">📝</span><span class="label">Open Markdown snippets</span></button>
        </div>

        <hr class="divider"/>

        <div class="section-label">Twig / Theme</div>
        <div class="btn-grid">
          <button onclick="send('layout')"><span class="icon">🗂</span><span class="label">!layout</span></button>
          <button onclick="send('theme')"><span class="icon">🎨</span><span class="label">!theme</span></button>
          <button onclick="send('nav')"><span class="icon">🔗</span><span class="label">!nav</span></button>
          <button onclick="send('pagelist')"><span class="icon">📋</span><span class="label">!pagelist</span></button>
          <button class="wide" onclick="send('twigSnippets')"><span class="icon">🧩</span><span class="label">Open Twig snippets</span></button>
        </div>

        <hr class="divider"/>

        <div class="section-label">PHP Snippets</div>
        <div class="btn-grid">
          <button onclick="send('plugin')"><span class="icon">🔌</span><span class="label">!plugin</span></button>
          <button class="wide" onclick="send('phpSnippets')"><span class="icon">🐘</span><span class="label">Open PHP snippets</span></button>
        </div>

        <hr class="divider"/>

        <div class="section-label">Auth / Forms</div>
        <div class="btn-grid">
          <button onclick="send('login')"><span class="icon">🔐</span><span class="label">!login</span></button>
          <button onclick="send('register')"><span class="icon">📝</span><span class="label">!register</span></button>
          <button onclick="send('forgot')"><span class="icon">🔑</span><span class="label">!forgot</span></button>
          <button onclick="send('contact')"><span class="icon">✉️</span><span class="label">!contact</span></button>
          <button onclick="send('profile')"><span class="icon">👤</span><span class="label">!profile</span></button>
          <button onclick="send('logout')"><span class="icon">🚪</span><span class="label">!logout</span></button>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          function send(command) { vscode.postMessage({ command }); }
        </script>
      </body>
      </html>
    `;
  }
}

// ===============================
// Activate
// ===============================
export function activate(context: vscode.ExtensionContext) {
  try {
    console.log("🚀 pico-helper activate() called");
    console.log("📌 Registering sidebar provider for", PicoSidebarProvider.viewType);
    
    const registration = vscode.window.registerWebviewViewProvider(
      PicoSidebarProvider.viewType,
      new PicoSidebarProvider(context),
    );
    
    context.subscriptions.push(registration);
    console.log("✅ Sidebar provider registered successfully");

    // Register command to open sidebar
    context.subscriptions.push(
      vscode.commands.registerCommand("pico-helper.openSidebar", async () => {
        console.log("🔄 Attempting to open Pico Helper sidebar...");
        try {
          await vscode.commands.executeCommand("workbench.view.extension.pico-helper-container");
          console.log("✅ Sidebar opened successfully");
        } catch (error) {
          console.error("❌ Failed to open sidebar:", error);
          vscode.window.showErrorMessage(`ไม่สามารถเปิด Pico Helper Sidebar: ${error}`);
        }
      }),
    );
  } catch (error) {
    console.error("❌ ERROR in activate():", error);
  }

  // ---- Status Bar: ปุ่มเปิด Live Preview ----
  const previewBtn = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100,
  );
  previewBtn.text = "$(preview) Pico Preview";
  previewBtn.command = "pico-helper.preview";
  previewBtn.tooltip = "เปิดพรีวิว Markdown แบบสด";
  previewBtn.show();
  context.subscriptions.push(previewBtn);

  // ===== Login Status Bar Button =====
  const loginBtn = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    98,
  );
  loginBtn.text = "$(account) Login";
  loginBtn.command = "pico-helper.login";
  loginBtn.tooltip = "Login to Pico Helper";
  loginBtn.show();
  context.subscriptions.push(loginBtn);

  // ---- Status Bar: สถานะ Lint ----
  const lintStatus = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99,
  );
  lintStatus.text = "$(check) Lint: -";
  lintStatus.tooltip = "สถานะ Lint ของไฟล์ปัจจุบัน";
  lintStatus.show();
  context.subscriptions.push(lintStatus);

  // ---- Diagnostic collection ----
  const diagnostics = vscode.languages.createDiagnosticCollection("pico-lint");
  context.subscriptions.push(diagnostics);

  // ===== helper: นับเฉพาะปัญหาจริง (Error/Warning) =====
  function countRealProblems(diags: vscode.Diagnostic[]) {
    return diags.filter(
      (d) =>
        d.severity === vscode.DiagnosticSeverity.Error ||
        d.severity === vscode.DiagnosticSeverity.Warning,
    ).length;
  }

  // อัปเดต Lint + Status เดียวจบ
  const updateLintFor = (doc?: vscode.TextDocument) => {
    const active = doc ?? vscode.window.activeTextEditor?.document;
    if (!active) {
      lintStatus.text = "$(check) Lint: -";
      lintStatus.tooltip = "ไม่มีเอกสารที่เปิดอยู่";
      lintStatus.command = undefined;
      return;
    }
    if (active.languageId !== "markdown" && active.languageId !== "twig") {
      diagnostics.set(active.uri, []);
      lintStatus.text = "$(pass-filled) Lint: n/a";
      lintStatus.tooltip = "รองรับเฉพาะ Markdown (.md) และ Twig (.twig)";
      lintStatus.command = undefined;
      return;
    }

    const diags = lintDocument(active);
    diagnostics.set(active.uri, diags);

    const real = countRealProblems(diags);
    if (real > 0) {
      lintStatus.text = `$(warning) Lint: ${real}`;
      lintStatus.tooltip = "คลิกเพื่อเปิด Problems Panel";
      lintStatus.command = "workbench.actions.view.problems";
    } else {
      lintStatus.text = "$(check) Lint: OK";
      lintStatus.tooltip = "ไฟล์นี้ไม่มีปัญหา (Error/Warning)";
      lintStatus.command = undefined;
    }
  };

  // เริ่มต้น
  vscode.workspace.textDocuments.forEach((doc) => {
    if (doc.languageId === "markdown" || doc.languageId === "twig") {
      diagnostics.set(doc.uri, lintDocument(doc));
    }
  });
  updateLintFor();

  // เหตุการณ์ที่ต้องลินต์แบบสด
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => {
      if (doc.languageId === "markdown" || doc.languageId === "twig") {
        diagnostics.set(doc.uri, lintDocument(doc));
      }
      updateLintFor(doc);
    }),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (
        e.document.languageId === "markdown" ||
        e.document.languageId === "twig"
      ) {
        diagnostics.set(e.document.uri, lintDocument(e.document));
      }
      updateLintFor(e.document);
    }),
    vscode.workspace.onDidSaveTextDocument((doc) => {
      if (doc.languageId === "markdown" || doc.languageId === "twig") {
        diagnostics.set(doc.uri, lintDocument(doc));
      }
      updateLintFor(doc);
    }),
    vscode.workspace.onDidCloseTextDocument((doc) => {
      diagnostics.delete(doc.uri);
      updateLintFor();
    }),
    vscode.window.onDidChangeActiveTextEditor(() => updateLintFor()),
  );

  // ---- Command: Lint ไฟล์ปัจจุบัน ----
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.lintFile", () => {
      const doc = vscode.window.activeTextEditor?.document;
      if (
        !doc ||
        (doc.languageId !== "markdown" && doc.languageId !== "twig")
      ) {
        vscode.window.showInformationMessage(
          "เปิดไฟล์ Markdown หรือ Twig ก่อน",
        );
        return;
      }
      const diags = lintDocument(doc);
      diagnostics.set(doc.uri, diags);
      updateLintFor(doc);

      const real = countRealProblems(diags);
      if (real > 0) {
        vscode.window.showWarningMessage(
          `พบ ${real} ปัญหา (Error/Warning) ในไฟล์นี้`,
        );
      } else {
        vscode.window.showInformationMessage(
          "ไม่พบปัญหา (Error/Warning) ในไฟล์นี้",
        );
      }
    }),
  );

  // ---- Command: Hello ----
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.helloWorld", () => {
      vscode.window.showInformationMessage(
        "Hello World! Welcome to Pico Helper Extension!",
      );
    }),
  );

  // ---- Command: สร้าง Markdown ----
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.createMarkdown", async () => {
      const folder = await pickWorkspaceFolder();
      if (!folder) {
        vscode.window.showErrorMessage("กรุณาเปิดหรือเลือกโฟลเดอร์โปรเจกต์");
        return;
      }

      const basename = await vscode.window.showInputBox({
        prompt: "ชื่อไฟล์ Markdown (เช่น: about)",
        validateInput: (v) =>
          !v || /[\\/:*?"<>|]/.test(v)
            ? 'ชื่อไฟล์ห้ามมีอักขระพิเศษ \\ / : * ? " < > |'
            : undefined,
      });
      if (!basename) return;

      const title = await vscode.window.showInputBox({
        prompt: "Title ของหน้า (เว้นว่าง = ใช้ชื่อไฟล์)",
        value: basename,
      });

      const contentDir = path.join(folder, "content");
      const filePath = path.join(contentDir, `${basename}.md`);
      await fs.promises.mkdir(contentDir, { recursive: true });

      if (fs.existsSync(filePath)) {
        const pick = await vscode.window.showWarningMessage(
          `มีไฟล์ ${basename}.md อยู่แล้ว ต้องการเขียนทับหรือไม่?`,
          { modal: true },
          "เขียนทับ",
          "ยกเลิก",
        );
        if (pick !== "เขียนทับ") return;
      }

      const date = formatDateYYYYMMDD(new Date());
      const content = `---
Title: ${title || basename}
Date: ${date}
Description: คำอธิบาย
---
# ${title || basename}

ยินดีต้อนรับสู่ Pico CMS
`;

      await fs.promises.writeFile(filePath, content, "utf8");

      const doc = await vscode.workspace.openTextDocument(
        vscode.Uri.file(filePath),
      );
      await vscode.window.showTextDocument(doc, { preview: false });
      await vscode.commands.executeCommand(
        "revealInExplorer",
        vscode.Uri.file(filePath),
      );
      vscode.window.showInformationMessage(
        `สร้างไฟล์ ${basename}.md เรียบร้อยแล้ว`,
      );
      await vscode.commands.executeCommand("pico-helper.preview");
    }),
  );

  // ---- Autocomplete: Markdown (พิมพ์ p) ----
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "markdown" },
      {
        provideCompletionItems() {
          const item = new vscode.CompletionItem(
            "pico-front",
            vscode.CompletionItemKind.Snippet,
          );
          item.detail = "Pico: Front Matter";
          item.documentation = new vscode.MarkdownString(
            "แทรก Front Matter สำหรับ Pico CMS",
          );
          item.insertText = new vscode.SnippetString(
            `---
Title: \${1:ชื่อบทความ}
Description: \${2:คำอธิบาย}
Author: \${3:ผู้เขียน}
Date: \${4:${formatDateYYYYMMDD(new Date())}}
Template: \${5:index}
Tags: [\${6:tag1, tag2}]
---
# \${1:ชื่อบทความ}

\${0:เนื้อหาเริ่มต้น}`,
          );
          item.preselect = true;
          item.sortText = "0000_pico_front";
          item.filterText = "p pico pico-front front";
          return [item];
        },
      },
      "p",
    ),
  );

  // ---- Autocomplete: Twig ({ / %) ----
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "twig" },
      {
        provideCompletionItems() {
          const block = new vscode.CompletionItem(
            "twig-block",
            vscode.CompletionItemKind.Snippet,
          );
          block.detail = "Twig: block";
          block.insertText = new vscode.SnippetString(
            `{% block \${1:content} %}
  \${0}
{% endblock %}`,
          );
          block.preselect = true;
          block.sortText = "0000_twig_block";

          const inc = new vscode.CompletionItem(
            "twig-include",
            vscode.CompletionItemKind.Snippet,
          );
          inc.detail = "Twig: include";
          inc.insertText = new vscode.SnippetString(
            `{% include "\${1:partials/header}.twig" %}`,
          );
          inc.sortText = "0001_twig_include";

          return [block, inc];
        },
      },
      "{",
      "%",
    ),
  );

  // ---- Live Preview: Markdown ----
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.preview", () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "markdown") {
        vscode.window.showInformationMessage(
          "เปิดไฟล์ Markdown ก่อน แล้วค่อยสั่งพรีวิว",
        );
        return;
      }

      const doc = editor.document;
      const panel = vscode.window.createWebviewPanel(
        "picoPreview",
        `Pico Preview — ${doc.fileName.split(/[\\/]/).pop()}`,
        vscode.ViewColumn.Beside,
        { enableScripts: true, retainContextWhenHidden: true },
      );

      const update = () => {
        panel.webview.html = renderMarkdownToHtml(doc.getText());
      };
      update();
      const changeSub = vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document === doc) update();
      });
      panel.onDidDispose(() => changeSub.dispose());
    }),
  );

  // ---- Quick Fix (Code Actions) : ใช้กับ diagnostics ที่เราสร้าง ----
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ["markdown", "twig"],
      {
        provideCodeActions(document, _range, contextArg) {
          const fixes: vscode.CodeAction[] = [];

          for (const diag of contextArg.diagnostics) {
            const msg = diag.message || "";

            // 1) ไม่มี Front Matter -> แทรกให้
            if (msg.includes("ไม่มี Front Matter")) {
              const fix = new vscode.CodeAction(
                "เพิ่ม Front Matter มาตรฐาน",
                vscode.CodeActionKind.QuickFix,
              );
              const fm = `---\nTitle: title\nDate: ${formatDateYYYYMMDD(new Date())}\nDescription: คำอธิบาย\n---\n\n`;
              fix.edit = new vscode.WorkspaceEdit();
              fix.edit.insert(document.uri, new vscode.Position(0, 0), fm);
              fix.diagnostics = [diag];
              fixes.push(fix);
            }

            // 2) หัวข้อควรเว้นวรรคหลัง #
            if (msg.includes("หัวข้อควรเว้นวรรค")) {
              const lineIdx = diag.range.start.line;
              const lineText = document.lineAt(lineIdx).text;
              const fixed = lineText.replace(/^(#+)(\S)/, "$1 $2");
              const fix = new vscode.CodeAction(
                "ใส่ช่องว่างหลัง #",
                vscode.CodeActionKind.QuickFix,
              );
              fix.edit = new vscode.WorkspaceEdit();
              fix.edit.replace(
                document.uri,
                new vscode.Range(
                  new vscode.Position(lineIdx, 0),
                  new vscode.Position(lineIdx, lineText.length),
                ),
                fixed,
              );
              fix.diagnostics = [diag];
              fixes.push(fix);
            }

            // 3) ลิงก์ผิดรูปแบบ -> ครอบเป็น [text](https://url)
            if (msg.includes("ลิงก์ Markdown ควรเป็น")) {
              const bad = document.getText(diag.range);
              const fixed = bad.replace(
                /\[([^\]]+)\]\s*(\S+)/,
                "[$1](https://$2)",
              );
              const fix = new vscode.CodeAction(
                "แก้ลิงก์ให้เป็น [text](url)",
                vscode.CodeActionKind.QuickFix,
              );
              fix.edit = new vscode.WorkspaceEdit();
              fix.edit.replace(document.uri, diag.range, fixed);
              fix.diagnostics = [diag];
              fixes.push(fix);
            }
          }

          return fixes;
        },
      },
      // metadata ต้องอยู่ "อาร์กิวเมนต์ที่สาม"
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] },
    ),
  );
// ===============================
// Login Template (Smart Insert/Create)
// ===============================
context.subscriptions.push(
  vscode.commands.registerCommand("pico-helper.login", async () => {

    const editor = vscode.window.activeTextEditor;

    const loginTemplate = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <style>
    :root {
      color-scheme: light;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      background: radial-gradient(circle at top, rgba(59,130,246,.12), transparent 32%),
                  linear-gradient(180deg, #e2e8f0 0%, #f8fafc 100%);
    }

    .login-card {
      width: min(420px, 100%);
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 25px 80px rgba(15, 23, 42, 0.12);
      border: 1px solid rgba(148, 163, 184, 0.18);
      overflow: hidden;
    }

    .login-header {
      padding: 2rem 2rem 1.5rem;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
    }

    .login-header h1 {
      font-size: 1.9rem;
      line-height: 1.1;
      margin-bottom: 0.35rem;
    }

    .login-header p {
      margin-top: 0.5rem;
      opacity: 0.85;
      font-size: 0.95rem;
    }

    .login-body {
      padding: 2rem;
    }

    .login-body form {
      display: grid;
      gap: 1rem;
    }

    .login-body input {
      width: 100%;
      padding: 0.95rem 1rem;
      border-radius: 0.85rem;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      font-size: 0.98rem;
      color: #0f172a;
    }

    .login-body input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16);
    }

    .login-body button {
      width: 100%;
      padding: 0.95rem 1rem;
      border-radius: 0.95rem;
      border: none;
      font-weight: 700;
      background: #2563eb;
      color: white;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.15s ease;
    }

    .login-body button:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .login-body .help-text {
      font-size: 0.95rem;
      color: #64748b;
      text-align: center;
      margin-top: 0.75rem;
    }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="login-header">
      <h1>เข้าสู่ระบบ</h1>
      <p>กรุณาเข้าสู่ระบบเพื่อใช้งานเว็บไซต์</p>
    </div>
    <div class="login-body">
      <form method="POST" action="/login">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p class="help-text">ลืมรหัสผ่าน? เลือกหน้าลืมรหัสผ่านในเมนู</p>
    </div>
  </div>
</body>
</html>`;

    // =========================
    // ✅ INSERT MODE (มีไฟล์เปิดอยู่)
    // =========================
    if (editor) {
      editor.edit(editBuilder => {
          editBuilder.insert(editor.selection.active, loginTemplate);
      });

      vscode.window.showInformationMessage("Inserted Login template.");
      vscode.window.setStatusBarMessage("$(check)Pico: Login inserted", 2000);
    return;
  }

    // =========================
    // ✅ CREATE FILE MODE (ไม่มีไฟล์)
    // =========================
    const folder = vscode.workspace.workspaceFolders?.[0];

    if (!folder) {
      vscode.window.showErrorMessage("Open a project folder first.");
      return;
    }

    const filePath = path.join(folder.uri.fsPath, "login.html");

    await fs.promises.writeFile(filePath, loginTemplate, "utf8");

    const doc = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage("Login file created.");
    vscode.window.setStatusBarMessage("$(check)Pico: Login file created", 2000);
    
  })
);

// ===============================
// Register Template (Smart Insert/Create)
// ===============================
context.subscriptions.push(
  vscode.commands.registerCommand("pico-helper.register", async () => {

    const editor = vscode.window.activeTextEditor;

    const registerTemplate = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
  <style>
    :root {
      color-scheme: light;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      background: linear-gradient(180deg, #e2e8f0 0%, #f8fafc 100%);
    }

    .register-card {
      width: min(480px, 100%);
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 25px 80px rgba(15, 23, 42, 0.12);
      border: 1px solid rgba(148, 163, 184, 0.18);
      overflow: hidden;
    }

    .register-header {
      padding: 2rem;
      background: #ffffff;
      border-bottom: 1px solid rgba(148, 163, 184, 0.16);
    }

    .register-header h1 {
      font-size: 1.9rem;
      margin-bottom: 0.5rem;
    }

    .register-header p {
      color: #475569;
      line-height: 1.5;
    }

    .register-body {
      padding: 2rem;
    }

    .register-body form {
      display: grid;
      gap: 1rem;
    }

    .register-body input {
      width: 100%;
      padding: 1rem 1.05rem;
      border-radius: 0.95rem;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      font-size: 1rem;
      color: #0f172a;
    }

    .register-body input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16);
    }

    .register-body button {
      width: 100%;
      padding: 1rem 1.05rem;
      border-radius: 1rem;
      border: none;
      font-weight: 700;
      background: #2563eb;
      color: white;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.15s ease;
    }

    .register-body button:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .register-body .help-text {
      margin-top: 0.75rem;
      font-size: 0.95rem;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="register-card">
    <div class="register-header">
      <h1>สมัครสมาชิก</h1>
      <p>สร้างบัญชีเพื่อเข้าถึงเนื้อหาและฟีเจอร์เพิ่มเติม</p>
    </div>
    <div class="register-body">
      <form method="POST" action="/register">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirm_password" placeholder="Confirm Password" required />
        <button type="submit">Register</button>
      </form>
      <p class="help-text">มีบัญชีแล้ว? กลับไปยังหน้าล็อกอินเพื่อเข้าสู่ระบบ</p>
    </div>
  </div>
</body>
</html>`;

    // =========================
    // ✅ INSERT MODE
    // =========================
    if (editor) {
      editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, registerTemplate);
      });

      vscode.window.showInformationMessage("Inserted Register template.");
      vscode.window.setStatusBarMessage("$(check)Pico: Register inserted", 2000);
      return;
    }

    // =========================
    // ✅ CREATE FILE MODE
    // =========================
    const folder = vscode.workspace.workspaceFolders?.[0];

    if (!folder) {
      vscode.window.showErrorMessage("Open a project folder first.");
      return;
    }

    const filePath = path.join(folder.uri.fsPath, "register.html");

    await fs.promises.writeFile(filePath, registerTemplate, "utf8");

    const doc = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage("Register file created.");
    vscode.window.setStatusBarMessage("$(check)Pico: Register file created", 2000);
  })
);

  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.forgot", async () => {
      const forgotTemplate = `<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $token = $_POST['csrf_token'] ?? '';

    if (!hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        $error = 'Invalid request.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } else {
        $resetToken  = bin2hex(random_bytes(32));
        $resetExpiry = time() + (\${1:60} * 60);
        // TODO: Save token + expiry, then send email
        $success = 'If that email exists, a reset link has been sent.';
    }
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$0`;
      await insertTemplate(forgotTemplate, "forgot.php", "Forgot password");
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.contact", async () => {
      const contactTemplate = `<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = trim($_POST['name'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '(No subject)');
    $message = trim($_POST['message'] ?? '');
    $token   = $_POST['csrf_token'] ?? '';

    if (!hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        $error = 'Invalid request.';
    } elseif (empty($name) || empty($email) || empty($message)) {
        $error = 'Please fill in all required fields.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email address.';
    } else {
        $to      = '\${1:admin@yoursite.com}';
        $headers = implode("\r\n", [
            'From: ' . $name . ' <' . $email . '>',
            'Reply-To: ' . $email,
            'Content-Type: text/plain; charset=UTF-8',
        ]);
        if (mail($to, $subject, $message, $headers)) {
            $success = 'Your message has been sent!';
        } else {
            $error = 'Failed to send message. Please try again.';
        }
    }
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$0`;
      await insertTemplate(contactTemplate, "contact.php", "Contact form");
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.profile", async () => {
      const profileTemplate = `<?php
session_start();

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    header('Location: \${1:/login}');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $displayName = trim($_POST['display_name'] ?? '');
    $email       = trim($_POST['email'] ?? '');
    $newPassword = $_POST['new_password'] ?? '';
    $token       = $_POST['csrf_token'] ?? '';

    if (!hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        $error = 'Invalid request.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email address.';
    } else {
        $updateData = [
            'display_name' => htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8'),
            'email'        => $email,
            'updated_at'   => date('Y-m-d H:i:s'),
        ];
        if (!empty($newPassword)) {
            if (strlen($newPassword) < \${2:8}) {
                $error = 'Password must be at least \${2:8} characters.';
            } else {
                $updateData['password'] = password_hash($newPassword, PASSWORD_BCRYPT);
            }
        }
        if (!isset($error)) {
            // TODO: Persist $updateData
            $success = 'Profile updated successfully.';
        }
    }
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$0`;
      await insertTemplate(profileTemplate, "profile.php", "Profile update");
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.logout", async () => {
      const logoutTemplate = `<?php
session_start();
session_unset();
session_destroy();

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}

header('Location: \${1:/}');
exit;
`;
      await insertTemplate(logoutTemplate, "logout.php", "Logout");
    }),
  );

  async function insertTemplate(
    template: string,
    fileName: string,
    actionLabel: string,
  ) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      await editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, template);
      });

      vscode.window.showInformationMessage(`Inserted ${actionLabel} template.`);
      vscode.window.setStatusBarMessage(`$(check)Pico: ${actionLabel} inserted`, 2000);
      return;
    }

    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) {
      vscode.window.showErrorMessage("Open a project folder first.");
      return;
    }

    const filePath = path.join(folder.uri.fsPath, fileName);
    await fs.promises.writeFile(filePath, template, "utf8");

    const doc = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage(`${actionLabel} file created.`);
    vscode.window.setStatusBarMessage(`$(check)Pico: ${actionLabel} file created`, 2000);
  }

  async function showSnippetPicker(language: string, snippetFile: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(
        "เปิดไฟล์เป้าหมายก่อน แล้วลองเลือก snippet อีกครั้ง",
      );
      return;
    }

    const langMap: Record<string, string> = {
      markdown: "markdown",
      twig: "twig",
      php: "php",
    };

    const expected = langMap[language];
    if (editor.document.languageId !== expected) {
      vscode.window.showInformationMessage(
        `เปิดไฟล์ ${expected} ก่อน แล้วลองอีกครั้ง`,
      );
      return;
    }

    const snippetUri = vscode.Uri.joinPath(
      context.extensionUri,
      "snippets",
      snippetFile,
    );

    let raw: Uint8Array;
    try {
      raw = await vscode.workspace.fs.readFile(snippetUri);
    } catch (error) {
      vscode.window.showErrorMessage(`ไม่พบไฟล์ snippets/${snippetFile}`);
      return;
    }

    let snippets: Record<
      string,
      { prefix?: string; description?: string; body: string | string[] }
    >;
    try {
      snippets = JSON.parse(Buffer.from(raw).toString("utf8"));
    } catch (error) {
      vscode.window.showErrorMessage("โหลด snippets ไม่สำเร็จ");
      return;
    }

    const items = Object.entries(snippets).map(([label, def]) => ({
      label,
      description: def.description || def.prefix || "",
      detail: def.prefix ? `prefix: ${def.prefix}` : undefined,
      body: Array.isArray(def.body) ? def.body.join("\n") : def.body,
    }));

    const picked = await vscode.window.showQuickPick(items, {
      placeHolder: `เลือก snippet ${language}`,
    });
    if (!picked) return;

    await editor.insertSnippet(new vscode.SnippetString(picked.body));
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.openMarkdownSnippets", async () => {
      await showSnippetPicker("markdown", "markdown.json");
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.openTwigSnippets", async () => {
      await showSnippetPicker("twig", "twig.json");
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.openPhpSnippets", async () => {
      await showSnippetPicker("php", "php.json");
    }),
  );


// ===============================
// !plugin — Pico Plugin Class
// ===============================
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.plugin", async () => {
      const lines = [
        "<?php",
        "",
        "/**",
        " * MyPlugin",
        " *",
        " * @author  Your Name",
        " * @link    https://yoursite.com",
        " * @license MIT",
        " * @version 1.0.0",
        " */",
        "class MyPlugin extends AbstractPicoPlugin",
        "{",
        "    const API_VERSION = 3;",
        "",
        "    protected $enabled = true;",
        "",
        "    protected $dependsOn = [];",
        "",
        "    public function onConfigLoaded(array &$config): void",
        "    {",
        "        // Access plugin config: $this->getPluginConfig('key', 'default')",
        "    }",
        "",
        "    public function onPagesLoaded(",
        "        array &$pages,",
        "        array &$currentPage = null,",
        "        array &$previousPage = null,",
        "        array &$nextPage = null",
        "    ): void {",
        "        // Modify $pages array here",
        "    }",
        "",
        "    public function onPageRendering(string &$templateName, array &$twigVariables): void",
        "    {",
        "        // Add Twig variables: $twigVariables['myVar'] = 'value';",
        "    }",
        "}",
      ];
      const tpl = lines.join("\n") + "\n";
      await insertTemplate(tpl, "MyPlugin.php", "!plugin");
    }),
  );

// ===============================
// !layout — Base Twig Layout
// ===============================
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.layout", async () => {
      const lines = [
        "<!DOCTYPE html>",
        "<html lang=\"{{ config.locale|default('en') }}\">",
        "<head>",
        "    <meta charset=\"UTF-8\">",
        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
        "    <title>{% block title %}{{ meta.title }} — {{ config.site_title }}{% endblock %}</title>",
        "    {% block meta %}",
        "        <meta name=\"description\" content=\"{{ meta.description|default(config.site_description) }}\">",
        "        <meta name=\"author\" content=\"{{ meta.author|default(config.author) }}\">",
        "    {% endblock %}",
        "    <style>",
        "        :root { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; background: #f8fafc; }",
        "        * { box-sizing: border-box; margin: 0; padding: 0; }",
        "        html { scroll-behavior: smooth; }",
        "        body { background: #f1f5f9; color: #0f172a; line-height: 1.75; min-height: 100vh; }",
        "        body, html { width: 100%; }",
        "        .site-shell { max-width: 1100px; margin: 0 auto; padding: 1.5rem; }",
        "        header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 1.5rem 2rem; border-radius: 1.5rem; box-shadow: 0 20px 50px rgba(15,23,42,.12); }",
        "        .brand { font-size: 1.45rem; font-weight: 700; text-decoration: none; color: white; }",
        "        nav.site-nav { display: flex; flex-wrap: wrap; gap: 0.85rem; }",
        "        nav.site-nav a { display: inline-flex; padding: 0.7rem 1rem; border-radius: 0.85rem; color: #cbd5e1; text-decoration: none; background: rgba(255,255,255,0.08); transition: all 0.2s ease; }",
        "        nav.site-nav a:hover, nav.site-nav .active a { background: rgba(255,255,255,0.18); color: white; }",
        "        main { background: white; border-radius: 0 0 1.5rem 1.5rem; padding: 2rem; border: 1px solid rgba(148,163,184,.16); box-shadow: 0 20px 50px rgba(15,23,42,.08); margin-top: -1.5rem; }",
        "        .page-card { max-width: 960px; margin: 0 auto; }",
        "        h1 { font-size: clamp(2rem, 2.4vw, 3rem); margin-bottom: 1rem; }",
        "        .lead { margin-top: 0.75rem; color: #475569; }",
        "        footer { text-align: center; margin: 2rem auto 0; color: #64748b; font-size: 0.95rem; }",
        "        @media (max-width: 720px) { header { padding: 1.25rem 1rem; } main { margin-top: 0; padding: 1.5rem; } nav.site-nav { justify-content: center; } }",
        "    </style>",
        "</head>",
        "<body class=\"{% block body_class %}{% endblock %}\">",
        "    <div class=\"site-shell\">",
        "        {% block header %}",
        "            <header>",
        "                <a class=\"brand\" href=\"{{ base_url }}\">{{ config.site_title }}</a>",
        "                {% block nav %}{% endblock %}",
        "            </header>",
        "        {% endblock %}",
        "        {% block main %}",
        "            <main>",
        "                <section class=\"page-card\">",
        "                    {% block content %}{{ content }}{% endblock %}",
        "                </section>",
        "            </main>",
        "        {% endblock %}",
        "        {% block footer %}",
        "            <footer>",
        "                <p>&copy; {{ 'now'|date('Y') }} {{ config.site_title }}</p>",
        "            </footer>",
        "        {% endblock %}",
        "    </div>",
        "    <script src=\"{{ theme_url }}/js/main.js\"></script>",
        "    {% block scripts %}{% endblock %}",
        "</body>",
        "</html>",
      ];
      const tpl = lines.join("\n") + "\n";
      await insertTemplate(tpl, "index.twig", "!layout");
    }),
  );

// ===============================
// !nav — Twig Navigation
// ===============================
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.nav", async () => {
      const tpl = `<nav class="site-nav">
    <ul class="site-menu">
    {% for page in pages %}
        {% if not page.hidden and page.id != '404' %}
        <li class="{% if page.id == current_page.id %}active{% endif %}">
            <a href="{{ page.url }}">{{ page.title }}</a>
        </li>
        {% endif %}
    {% endfor %}
    </ul>
</nav>
`;
      await insertTemplate(tpl, "_nav.twig", "!nav");
    }),
  );

// ===============================
// !pagelist — Twig Page Listing
// ===============================
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.pagelist", async () => {
      const tpl = `<section class="page-list-section">
    <ul class="page-list">
    {% for page in pages %}
        {% if not page.hidden and page.id starts with 'blog/' %}
        <li class="page-list-item">
            <a href="{{ page.url }}">{{ page.title }}</a>
            {% if page.date %}<time datetime="{{ page.date_formatted }}">{{ page.date_formatted }}</time>{% endif %}
            {% if page.description %}<p>{{ page.description }}</p>{% endif %}
            {% if page.tags %}
                <ul class="tags">
                    {% for tag in page.tags %}<li>{{ tag }}</li>{% endfor %}
                </ul>
            {% endif %}
        </li>
        {% endif %}
    {% else %}
        <li>No posts found.</li>
    {% endfor %}
    </ul>
</section>
`;
      await insertTemplate(tpl, "_pagelist.twig", "!pagelist");
    }),
  );

  // ===============================
  // !theme — Full Theme Template
  // ===============================
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.theme", async () => {
      const lines = [
        "<!DOCTYPE html>",
        "<html lang=\"th\">",
        "<head>",
        "    <meta charset=\"UTF-8\">",
        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
        "    <title>{{ meta.title }} — {{ config.site_title }}</title>",
        "    <style>",
        "        * { box-sizing: border-box; margin: 0; padding: 0; }",
        "        html { scroll-behavior: smooth; }",
        "        body { font-family: Inter, system-ui, sans-serif; background: #f8fafc; color: #111827; line-height: 1.7; }",
        "        a { color: #2563eb; text-decoration: none; }",
        "        a:hover { text-decoration: underline; }",
        "        header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 1.25rem 1.5rem; }",
        "        .header-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }",
        "        .brand { font-size: 1.35rem; font-weight: 700; }",
        "        .site-nav { display: flex; gap: 1rem; flex-wrap: wrap; }",
        "        .site-nav a { padding: 0.5rem 0.75rem; border-radius: 0.65rem; color: #cbd5e1; }",
        "        .site-nav a:hover, .site-nav .active a { background: rgba(255,255,255,0.1); color: white; }",
        "        main { max-width: 980px; margin: 2rem auto; padding: 0 1.5rem; }",
        "        .page-card { background: white; border-radius: 1.5rem; box-shadow: 0 20px 50px rgba(15,23,42,0.08); border: 1px solid rgba(148,163,184,0.16); padding: 2rem; }",
        "        h1 { font-size: clamp(2rem, 2.4vw, 3rem); margin-bottom: 1rem; }",
        "        .lead { margin-top: 0.75rem; color: #475569; }",
        "        footer { text-align: center; margin: 3rem auto 1rem; color: #64748b; font-size: 0.95rem; }",
        "        @media (max-width: 720px) { .header-inner { flex-direction: column; align-items: stretch; } main { margin: 1.25rem auto; padding: 0 1rem; } }",
        "    </style>",
        "</head>",
        "<body>",
        "    <header>",
        "        <div class=\"header-inner\">",
        "            <a class=\"brand\" href=\"{{ base_url }}\">{{ config.site_title }}</a>",
        "            <nav class=\"site-nav\">",
        "                {% for page in pages %}",
        "                    {% if not page.hidden and page.id != '404' %}",
        "                        <a class=\"{% if page.id == current_page.id %}active{% endif %}\" href=\"{{ page.url }}\">{{ page.title }}</a>",
        "                    {% endif %}",
        "                {% endfor %}",
        "            </nav>",
        "        </div>",
        "    </header>",
        "    <main>",
        "        <section class=\"page-card\">",
        "            <h1>{{ meta.title }}</h1>",
        "            {% if meta.description %}<p class=\"lead\">{{ meta.description }}</p>{% endif %}",
        "            {{ content }}",
        "        </section>",
        "    </main>",
        "    <footer>",
        "        <p>&copy; {{ 'now'|date('Y') }} {{ config.site_title }}</p>",
        "    </footer>",
        "</body>",
        "</html>",
      ];
      const tpl = lines.join("\n") + "\n";
      await insertTemplate(tpl, "theme.twig", "!theme");
    }),
  );

// ===============================
// !page — New Pico Page (.md)
// ===============================
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.page", async () => {
      const date = formatDateYYYYMMDD(new Date());
      const tpl = `---
Title:       Page Title
Description: A short description of this page.
Author:      Your Name
Date:        ${date}
Template:    index
---

## Page Title

Write your content here using Markdown.
`;
      await insertTemplate(tpl, "new-page.md", "!page");
    }),
  );

// ===============================
// !blog — New Blog Post (.md)
// ===============================
  context.subscriptions.push(
    vscode.commands.registerCommand("pico-helper.blog", async () => {
      const date = formatDateYYYYMMDD(new Date());
      const tpl = `---
Title:       Post Title
Description: A brief summary of this post.
Author:      Your Name
Date:        ${date}
Template:    blog-post
Tags:        [tag1, tag2]
---

## Post Title

Write your blog content here.
`;
      await insertTemplate(tpl, "new-post.md", "!blog");
    }),
  );

// ===============================
// Deactivate
// ===============================

} // end activate()

export function deactivate() {}

// ===============================
// Lint Core
// ===============================
function lintDocument(doc: vscode.TextDocument): vscode.Diagnostic[] {
  return doc.languageId === "markdown"
    ? lintMarkdown(doc)
    : doc.languageId === "twig"
      ? lintTwig(doc)
      : [];
}

function lintMarkdown(doc: vscode.TextDocument): vscode.Diagnostic[] {
  const text = doc.getText();
  const diags: vscode.Diagnostic[] = [];

  // Front Matter
  const fmMatch = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*/);
  let fmBody = "";
  let fmOffset = 0;

  if (!fmMatch) {
    const firstLineLen = (text.split(/\r?\n/, 1)[0] ?? "").length;
    diags.push(
      new vscode.Diagnostic(
        new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(0, Math.max(1, firstLineLen)),
        ),
        "ไม่มี Front Matter ที่ส่วนต้นไฟล์ (ต้องครอบด้วย --- ... ---)",
        vscode.DiagnosticSeverity.Error,
      ),
    );
  } else {
    fmBody = fmMatch[1];
    const fmStart = fmMatch.index ?? 0;
    // ปลอดภัยกับ \r\n: คำนวณ offset ของบอดี้จริง ๆ
    const beforeBodyLen = fmMatch[0].indexOf(fmBody);
    fmOffset = fmStart + (beforeBodyLen >= 0 ? beforeBodyLen : 4);

    const map: Record<string, string> = {};
    fmBody.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
      if (m) map[m[1]] = m[2];
    });

    if (!map["Title"] || !map["Title"].trim()) {
      diags.push(
        makeDiagAtKey(
          doc,
          fmBody,
          fmOffset,
          "Title",
          "Front Matter: ต้องมี Title",
          vscode.DiagnosticSeverity.Error,
        ),
      );
    }

    const date = map["Date"];
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!date) {
      diags.push(
        makeDiagAtKey(
          doc,
          fmBody,
          fmOffset,
          "Date",
          "Front Matter: ต้องมี Date (เช่น 2025-01-31)",
          vscode.DiagnosticSeverity.Error,
        ),
      );
    } else if (!dateRe.test(date)) {
      diags.push(
        makeDiagAtKey(
          doc,
          fmBody,
          fmOffset,
          "Date",
          "Date ควรเป็นรูปแบบ YYYY-MM-DD",
          vscode.DiagnosticSeverity.Warning,
        ),
      );
    }

    // ปรับเป็น Information เพื่อไม่ให้นับเป็นปัญหา
    if (!map["Template"] || !map["Template"].trim()) {
      diags.push(
        makeDiagAtKey(
          doc,
          fmBody,
          fmOffset,
          "Template",
          "แนะนำให้กำหนด Template (ข้อมูลเพิ่มเติม ไม่ใช่ปัญหา)",
          vscode.DiagnosticSeverity.Information,
        ),
      );
    }

    if (map["Tags"] && !/^\[.*\]$/.test(map["Tags"])) {
      diags.push(
        makeDiagAtKey(
          doc,
          fmBody,
          fmOffset,
          "Tags",
          "รูปแบบ Tags ควรเป็น [tag1, tag2]",
          vscode.DiagnosticSeverity.Warning,
        ),
      );
    }

    // จับคีย์ที่ดูเหมือนลืมใส่ ":"
    fmBody.split(/\r?\n/).forEach((line, i) => {
      if (/^\s*[A-Za-z0-9_-]+\s(?!:)/.test(line)) {
        const start = doc.positionAt(fmOffset + offsetAtLine(fmBody, i));
        const end = new vscode.Position(
          start.line,
          start.character + line.length,
        );
        diags.push(
          new vscode.Diagnostic(
            new vscode.Range(start, end),
            'รูปแบบ Front Matter ไม่ถูกต้อง (คีย์ต้องตามด้วย ":" เช่น Title: ...)',
            vscode.DiagnosticSeverity.Error,
          ),
        );
      }
    });
  }

  // Markdown rules: # เว้นวรรค, ลิงก์ผิดรูป
  const lines = text.split(/\r?\n/);

  lines.forEach((line, i) => {
    if (/^#{1,6}(?!\s|#)/.test(line)) {
      diags.push(
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(i, 0),
            new vscode.Position(i, line.length),
          ),
          'หัวข้อควรเว้นวรรคหลังเครื่องหมาย # (เช่น "# About")',
          vscode.DiagnosticSeverity.Warning,
        ),
      );
    }
  });

  const badLinkRe = /\[([^\]]+)\]\s*(?!\()(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = badLinkRe.exec(text))) {
    const start = doc.positionAt(m.index);
    const end = doc.positionAt(m.index + m[0].length);
    diags.push(
      new vscode.Diagnostic(
        new vscode.Range(start, end),
        "ลิงก์ Markdown ควรเป็นรูปแบบ [ข้อความ](url)",
        vscode.DiagnosticSeverity.Warning,
      ),
    );
  }

  return diags;
}

function offsetAtLine(s: string, lineIndex: number): number {
  let off = 0,
    n = 0;
  for (; n < lineIndex && off < s.length; n++) {
    const p = s.indexOf("\n", off);
    if (p === -1) return off;
    off = p + 1;
  }
  return off;
}

function lintTwig(doc: vscode.TextDocument): vscode.Diagnostic[] {
  const text = doc.getText();
  const diags: vscode.Diagnostic[] = [];

  const includeRe = /{%\s*include\s+["'](.+?)["']\s*%}/g;
  let inc: RegExpExecArray | null;
  while ((inc = includeRe.exec(text))) {
    const p = inc[1];
    if (!/\.twig$/i.test(p)) {
      const start = inc.index + inc[0].indexOf(inc[1]);
      const end = start + inc[1].length;
      diags.push(
        makeDiagRange(
          doc,
          start,
          end,
          "ไฟล์ include ควรลงท้ายด้วย .twig",
          vscode.DiagnosticSeverity.Warning,
        ),
      );
    }
  }

  type OpenTag = {
    kind: "if" | "for" | "block";
    startIndex: number;
    token: string;
  };
  const openStack: OpenTag[] = [];
  const tokenRe = /{%\s*(if|for|block)\b|{%\s*end(if|for|block)\s*%}/g;
  let t: RegExpExecArray | null;
  while ((t = tokenRe.exec(text))) {
    if (t[1]) {
      openStack.push({
        kind: t[1] as OpenTag["kind"],
        startIndex: t.index,
        token: t[0],
      });
    } else if (t[2]) {
      const kind = t[2] as OpenTag["kind"];
      const top = openStack.pop();
      if (!top || top.kind !== kind) {
        const start = t.index;
        const end = t.index + t[0].length;
        diags.push(
          makeDiagRange(
            doc,
            start,
            end,
            `พบ end${kind} ที่ไม่ตรงกับ ${top ? top.kind : "แท็กเปิด"}`,
            vscode.DiagnosticSeverity.Error,
          ),
        );
      }
    }
  }
  for (const open of openStack) {
    const start = open.startIndex;
    const end = open.startIndex + open.token.length;
    diags.push(
      makeDiagRange(
        doc,
        start,
        end,
        `แท็ก ${open.kind} ยังไม่ถูกปิด (missing end${open.kind})`,
        vscode.DiagnosticSeverity.Error,
      ),
    );
  }

  return diags;
}

// ===============================
// Diagnostic helpers
// ===============================
function makeDiagAtKey(
  doc: vscode.TextDocument,
  fmBody: string,
  fmOffset: number,
  key: string,
  message: string,
  severity: vscode.DiagnosticSeverity,
) {
  const re = new RegExp(`^\\s*${key}\\s*:`, "m");
  const m = re.exec(fmBody);
  if (m && typeof m.index === "number") {
    const abs = fmOffset + m.index;
    const start = doc.positionAt(abs);
    const range = new vscode.Range(
      start,
      new vscode.Position(start.line, start.character + key.length),
    );
    const d = new vscode.Diagnostic(range, message, severity);
    d.source = "pico";
    return d;
  }
  const pos = doc.positionAt(fmOffset);
  const range = new vscode.Range(
    pos,
    new vscode.Position(pos.line, pos.character + 1),
  );
  const d = new vscode.Diagnostic(range, message, severity);
  d.source = "pico";
  return d;
}

function makeDiagRange(
  doc: vscode.TextDocument,
  startOffset: number,
  endOffset: number,
  message: string,
  severity: vscode.DiagnosticSeverity,
) {
  const range = new vscode.Range(
    doc.positionAt(startOffset),
    doc.positionAt(endOffset),
  );
  const d = new vscode.Diagnostic(range, message, severity);
  d.source = "pico";
  return d;
}

// ===============================
// Markdown Preview (HTML)
// ===============================
function renderMarkdownToHtml(md: string): string {
  const escape = (s: string) =>
    s.replace(
      /[&<>]/g,
      (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[ch]!,
    );

  let html = md.replace(
    /```([\s\S]*?)```/g,
    (_m, code) => `<pre><code>${escape(code)}</code></pre>`,
  );
  html = html.replace(/^\s*---\s*$/gm, "<hr>");
  html = html.replace(/^\s*>\s?(.*)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/^(?:\s*[-*]\s+.*\n?)+/gm, (block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((line) => line.replace(/^\s*[-*]\s+(.*)$/, "<li>$1</li>"))
      .join("");
    return `<ul>${items}</ul>`;
  });
  html = html.replace(/^(?:\s*\d+\.\s+.*\n?)+/gm, (block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((line) => line.replace(/^\s*\d+\.\s+(.*)$/, "<li>$1</li>"))
      .join("");
    return `<ol>${items}</ol>`;
  });
  html = html
    .replace(/^######\s+(.*)$/gm, "<h6>$1</h6>")
    .replace(/^#####\s+(.*)$/gm, "<h5>$1</h5>")
    .replace(/^####\s+(.*)$/gm, "<h4>$1</h4>")
    .replace(/^###\s+(.*)$/gm, "<h3>$1</h3>")
    .replace(/^##\s+(.*)$/gm, "<h2>$1</h2>")
    .replace(/^#\s+(.*)$/gm, "<h1>$1</h1>");
  html = html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+?)`/g, "<code>$1</code>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );
  html = html
    .split(/\n{2,}/)
    .map((p) =>
      /^<h\d|^<pre|^<ul|^<ol|^<blockquote|^<hr/.test(p)
        ? p
        : `<p>${p.replace(/\n/g, "<br>")}</p>`,
    )
    .join("\n");

  const styles = `
    <style>
      :root { color-scheme: light dark; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, sans-serif; padding: 16px 24px; line-height: 1.65; }
      h1,h2,h3 { margin: 1rem 0 .5rem; }
      h1 { font-size: 1.8rem; } h2 { font-size: 1.4rem; } h3 { font-size: 1.2rem; }
      pre { background: rgba(127,127,127,.12); padding: .75rem; border-radius: .75rem; overflow:auto; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      a { text-decoration: none; border-bottom: 1px dotted currentColor; }
      ul,ol { padding-left: 1.25rem; }
      blockquote { margin: .75rem 0; padding: .5rem .75rem; border-left: 4px solid rgba(127,127,127,.35); background: rgba(127,127,127,.08); border-radius: .5rem; }
      hr { border: none; border-top: 1px solid rgba(127,127,127,.35); margin: 1rem 0; }
    </style>
  `;
  return `<!doctype html><html><head><meta charset="utf-8">${styles}</head><body>${html}</body></html>`;
}

// ===============================
// Helpers
// ===============================
function formatDateYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function pickWorkspaceFolder(): Promise<string | undefined> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return undefined;
  if (folders.length === 1) return folders[0].uri.fsPath;
  const picked = await vscode.window.showWorkspaceFolderPick({
    placeHolder: "เลือกโฟลเดอร์โปรเจกต์ Pico",
  });
  return picked?.uri.fsPath;
 }