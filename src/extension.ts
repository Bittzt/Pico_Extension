// ===============================
// VS Code API + Node modules
// ===============================
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// ===============================
// Activate
// ===============================
export function activate(context: vscode.ExtensionContext) {
  console.log('pico-helper activated');

  // ---- Status Bar: ปุ่มเปิด Live Preview ----
  const previewBtn = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  previewBtn.text = '$(preview) Pico Preview';
  previewBtn.command = 'pico-helper.preview';
  previewBtn.tooltip = 'เปิดพรีวิว Markdown แบบสด';
  previewBtn.show();
  context.subscriptions.push(previewBtn);

  // ---- Status Bar: สถานะ Lint ----
  const lintStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
  lintStatus.text = '$(check) Lint: -';
  lintStatus.tooltip = 'สถานะ Lint ของไฟล์ปัจจุบัน';
  lintStatus.show();
  context.subscriptions.push(lintStatus);

  // ---- Diagnostic collection ----
  const diagnostics = vscode.languages.createDiagnosticCollection('pico-lint');
  context.subscriptions.push(diagnostics);

  // ===== helper: นับเฉพาะปัญหาจริง (Error/Warning) =====
  function countRealProblems(diags: vscode.Diagnostic[]) {
    return diags.filter(d =>
      d.severity === vscode.DiagnosticSeverity.Error ||
      d.severity === vscode.DiagnosticSeverity.Warning
    ).length;
  }

  // อัปเดต Lint + Status เดียวจบ
  const updateLintFor = (doc?: vscode.TextDocument) => {
    const active = doc ?? vscode.window.activeTextEditor?.document;
    if (!active) {
      lintStatus.text = '$(check) Lint: -';
      lintStatus.tooltip = 'ไม่มีเอกสารที่เปิดอยู่';
      lintStatus.command = undefined;
      return;
    }
    if (active.languageId !== 'markdown' && active.languageId !== 'twig') {
      diagnostics.set(active.uri, []);
      lintStatus.text = '$(pass-filled) Lint: n/a';
      lintStatus.tooltip = 'รองรับเฉพาะ Markdown (.md) และ Twig (.twig)';
      lintStatus.command = undefined;
      return;
    }

    const diags = lintDocument(active);
    diagnostics.set(active.uri, diags);

    const real = countRealProblems(diags);
    if (real > 0) {
      lintStatus.text = `$(warning) Lint: ${real}`;
      lintStatus.tooltip = 'คลิกเพื่อเปิด Problems Panel';
      lintStatus.command = 'workbench.actions.view.problems';
    } else {
      lintStatus.text = '$(check) Lint: OK';
      lintStatus.tooltip = 'ไฟล์นี้ไม่มีปัญหา (Error/Warning)';
      lintStatus.command = undefined;
    }
  };

  // เริ่มต้น
  vscode.workspace.textDocuments.forEach(doc => {
    if (doc.languageId === 'markdown' || doc.languageId === 'twig') {
      diagnostics.set(doc.uri, lintDocument(doc));
    }
  });
  updateLintFor();

  // เหตุการณ์ที่ต้องลินต์แบบสด
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => {
      if (doc.languageId === 'markdown' || doc.languageId === 'twig') {
        diagnostics.set(doc.uri, lintDocument(doc));
      }
      updateLintFor(doc);
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.languageId === 'markdown' || e.document.languageId === 'twig') {
        diagnostics.set(e.document.uri, lintDocument(e.document));
      }
      updateLintFor(e.document);
    }),
    vscode.workspace.onDidSaveTextDocument(doc => {
      if (doc.languageId === 'markdown' || doc.languageId === 'twig') {
        diagnostics.set(doc.uri, lintDocument(doc));
      }
      updateLintFor(doc);
    }),
    vscode.workspace.onDidCloseTextDocument(doc => {
      diagnostics.delete(doc.uri);
      updateLintFor();
    }),
    vscode.window.onDidChangeActiveTextEditor(() => updateLintFor())
  );

  // ---- Command: Lint ไฟล์ปัจจุบัน ----
  context.subscriptions.push(
    vscode.commands.registerCommand('pico-helper.lintFile', () => {
      const doc = vscode.window.activeTextEditor?.document;
      if (!doc || (doc.languageId !== 'markdown' && doc.languageId !== 'twig')) {
        vscode.window.showInformationMessage('เปิดไฟล์ Markdown หรือ Twig ก่อน');
        return;
      }
      const diags = lintDocument(doc);
      diagnostics.set(doc.uri, diags);
      updateLintFor(doc);

      const real = countRealProblems(diags);
      if (real > 0) {
        vscode.window.showWarningMessage(`พบ ${real} ปัญหา (Error/Warning) ในไฟล์นี้`);
      } else {
        vscode.window.showInformationMessage('ไม่พบปัญหา (Error/Warning) ในไฟล์นี้');
      }
    })
  );

  // ---- Command: Hello ----
  context.subscriptions.push(
    vscode.commands.registerCommand('pico-helper.helloWorld', () => {
      vscode.window.showInformationMessage('Hello World! Welcome to Pico Helper Extension!');
    })
  );

  // ---- Command: สร้าง Markdown ----
  context.subscriptions.push(
    vscode.commands.registerCommand('pico-helper.createMarkdown', async () => {
      const folder = await pickWorkspaceFolder();
      if (!folder) {
        vscode.window.showErrorMessage('กรุณาเปิดหรือเลือกโฟลเดอร์โปรเจกต์');
        return;
      }

      const basename = await vscode.window.showInputBox({
        prompt: 'ชื่อไฟล์ Markdown (เช่น: about)',
        validateInput: v =>
          (!v || /[\\/:*?"<>|]/.test(v) ? 'ชื่อไฟล์ห้ามมีอักขระพิเศษ \\ / : * ? " < > |' : undefined)
      });
      if (!basename) return;

      const title = await vscode.window.showInputBox({
        prompt: 'Title ของหน้า (เว้นว่าง = ใช้ชื่อไฟล์)',
        value: basename
      });

      const contentDir = path.join(folder, 'content');
      const filePath = path.join(contentDir, `${basename}.md`);
      await fs.promises.mkdir(contentDir, { recursive: true });

      if (fs.existsSync(filePath)) {
        const pick = await vscode.window.showWarningMessage(
          `มีไฟล์ ${basename}.md อยู่แล้ว ต้องการเขียนทับหรือไม่?`,
          { modal: true },
          'เขียนทับ', 'ยกเลิก'
        );
        if (pick !== 'เขียนทับ') return;
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

      await fs.promises.writeFile(filePath, content, 'utf8');

      const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
      await vscode.window.showTextDocument(doc, { preview: false });
      await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(filePath));
      vscode.window.showInformationMessage(`สร้างไฟล์ ${basename}.md เรียบร้อยแล้ว`);
      await vscode.commands.executeCommand('pico-helper.preview');
    })
  );

  // ---- Autocomplete: Markdown (พิมพ์ p) ----
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'markdown' },
      {
        provideCompletionItems() {
          const item = new vscode.CompletionItem('pico-front', vscode.CompletionItemKind.Snippet);
          item.detail = 'Pico: Front Matter';
          item.documentation = new vscode.MarkdownString('แทรก Front Matter สำหรับ Pico CMS');
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

\${0:เนื้อหาเริ่มต้น}`
          );
          item.preselect = true;
          item.sortText = '0000_pico_front';
          item.filterText = 'p pico pico-front front';
          return [item];
        }
      },
      'p'
    )
  );

  // ---- Autocomplete: Twig ({ / %) ----
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'twig' },
      {
        provideCompletionItems() {
          const block = new vscode.CompletionItem('twig-block', vscode.CompletionItemKind.Snippet);
          block.detail = 'Twig: block';
          block.insertText = new vscode.SnippetString(
`{% block \${1:content} %}
  \${0}
{% endblock %}`
          );
          block.preselect = true;
          block.sortText = '0000_twig_block';

          const inc = new vscode.CompletionItem('twig-include', vscode.CompletionItemKind.Snippet);
          inc.detail = 'Twig: include';
          inc.insertText = new vscode.SnippetString(`{% include "\${1:partials/header}.twig" %}`);
          inc.sortText = '0001_twig_include';

          return [block, inc];
        }
      },
      '{', '%'
    )
  );

  // ---- Live Preview: Markdown ----
  context.subscriptions.push(
    vscode.commands.registerCommand('pico-helper.preview', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showInformationMessage('เปิดไฟล์ Markdown ก่อน แล้วค่อยสั่งพรีวิว');
        return;
      }

      const doc = editor.document;
      const panel = vscode.window.createWebviewPanel(
        'picoPreview',
        `Pico Preview — ${doc.fileName.split(/[\\/]/).pop()}`,
        vscode.ViewColumn.Beside,
        { enableScripts: true, retainContextWhenHidden: true }
      );

      const update = () => { panel.webview.html = renderMarkdownToHtml(doc.getText()); };
      update();
      const changeSub = vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document === doc) update();
      });
      panel.onDidDispose(() => changeSub.dispose());
    })
  );

  // ---- Quick Fix (Code Actions) : ใช้กับ diagnostics ที่เราสร้าง ----
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ['markdown', 'twig'],
      {
        provideCodeActions(document, _range, contextArg) {
          const fixes: vscode.CodeAction[] = [];

          for (const diag of contextArg.diagnostics) {
            const msg = diag.message || '';

            // 1) ไม่มี Front Matter -> แทรกให้
            if (msg.includes('ไม่มี Front Matter')) {
              const fix = new vscode.CodeAction('เพิ่ม Front Matter มาตรฐาน', vscode.CodeActionKind.QuickFix);
              const fm = `---\nTitle: title\nDate: ${formatDateYYYYMMDD(new Date())}\nDescription: คำอธิบาย\n---\n\n`;
              fix.edit = new vscode.WorkspaceEdit();
              fix.edit.insert(document.uri, new vscode.Position(0, 0), fm);
              fix.diagnostics = [diag];
              fixes.push(fix);
            }

            // 2) หัวข้อควรเว้นวรรคหลัง #
            if (msg.includes('หัวข้อควรเว้นวรรค')) {
              const lineIdx = diag.range.start.line;
              const lineText = document.lineAt(lineIdx).text;
              const fixed = lineText.replace(/^(#+)(\S)/, '$1 $2');
              const fix = new vscode.CodeAction('ใส่ช่องว่างหลัง #', vscode.CodeActionKind.QuickFix);
              fix.edit = new vscode.WorkspaceEdit();
              fix.edit.replace(
                document.uri,
                new vscode.Range(new vscode.Position(lineIdx, 0), new vscode.Position(lineIdx, lineText.length)),
                fixed
              );
              fix.diagnostics = [diag];
              fixes.push(fix);
            }

            // 3) ลิงก์ผิดรูปแบบ -> ครอบเป็น [text](https://url)
            if (msg.includes('ลิงก์ Markdown ควรเป็น')) {
              const bad = document.getText(diag.range);
              const fixed = bad.replace(/\[([^\]]+)\]\s*(\S+)/, '[$1](https://$2)');
              const fix = new vscode.CodeAction('แก้ลิงก์ให้เป็น [text](url)', vscode.CodeActionKind.QuickFix);
              fix.edit = new vscode.WorkspaceEdit();
              fix.edit.replace(document.uri, diag.range, fixed);
              fix.diagnostics = [diag];
              fixes.push(fix);
            }
          }

          return fixes;
        }
      },
      // metadata ต้องอยู่ "อาร์กิวเมนต์ที่สาม"
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    )
  );
}

// ===============================
// Deactivate
// ===============================
export function deactivate() {}

// ===============================
// Lint Core
// ===============================
function lintDocument(doc: vscode.TextDocument): vscode.Diagnostic[] {
  return doc.languageId === 'markdown'
    ? lintMarkdown(doc)
    : doc.languageId === 'twig'
    ? lintTwig(doc)
    : [];
}

function lintMarkdown(doc: vscode.TextDocument): vscode.Diagnostic[] {
  const text = doc.getText();
  const diags: vscode.Diagnostic[] = [];

  // Front Matter
  const fmMatch = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*/);
  let fmBody = '';
  let fmOffset = 0;

  if (!fmMatch) {
    const firstLineLen = (text.split(/\r?\n/, 1)[0] ?? '').length;
    diags.push(
      new vscode.Diagnostic(
        new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, Math.max(1, firstLineLen))),
        'ไม่มี Front Matter ที่ส่วนต้นไฟล์ (ต้องครอบด้วย --- ... ---)',
        vscode.DiagnosticSeverity.Error
      )
    );
  } else {
    fmBody = fmMatch[1];
    const fmStart = fmMatch.index ?? 0;
    // ปลอดภัยกับ \r\n: คำนวณ offset ของบอดี้จริง ๆ
    const beforeBodyLen = fmMatch[0].indexOf(fmBody);
    fmOffset = fmStart + (beforeBodyLen >= 0 ? beforeBodyLen : 4);

    const map: Record<string, string> = {};
    fmBody.split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
      if (m) map[m[1]] = m[2];
    });

    if (!map['Title'] || !map['Title'].trim()) {
      diags.push(makeDiagAtKey(doc, fmBody, fmOffset, 'Title', 'Front Matter: ต้องมี Title', vscode.DiagnosticSeverity.Error));
    }

    const date = map['Date'];
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!date) {
      diags.push(makeDiagAtKey(doc, fmBody, fmOffset, 'Date', 'Front Matter: ต้องมี Date (เช่น 2025-01-31)', vscode.DiagnosticSeverity.Error));
    } else if (!dateRe.test(date)) {
      diags.push(makeDiagAtKey(doc, fmBody, fmOffset, 'Date', 'Date ควรเป็นรูปแบบ YYYY-MM-DD', vscode.DiagnosticSeverity.Warning));
    }

    // ปรับเป็น Information เพื่อไม่ให้นับเป็นปัญหา
    if (!map['Template'] || !map['Template'].trim()) {
      diags.push(makeDiagAtKey(
        doc, fmBody, fmOffset, 'Template',
        'แนะนำให้กำหนด Template (ข้อมูลเพิ่มเติม ไม่ใช่ปัญหา)',
        vscode.DiagnosticSeverity.Information
      ));
    }

    if (map['Tags'] && !/^\[.*\]$/.test(map['Tags'])) {
      diags.push(makeDiagAtKey(doc, fmBody, fmOffset, 'Tags', 'รูปแบบ Tags ควรเป็น [tag1, tag2]', vscode.DiagnosticSeverity.Warning));
    }

    // จับคีย์ที่ดูเหมือนลืมใส่ ":" 
    fmBody.split(/\r?\n/).forEach((line, i) => {
      if (/^\s*[A-Za-z0-9_-]+\s(?!:)/.test(line)) {
        const start = doc.positionAt(fmOffset + offsetAtLine(fmBody, i));
        const end = new vscode.Position(start.line, start.character + line.length);
        diags.push(
          new vscode.Diagnostic(
            new vscode.Range(start, end),
            'รูปแบบ Front Matter ไม่ถูกต้อง (คีย์ต้องตามด้วย ":" เช่น Title: ...)',
            vscode.DiagnosticSeverity.Error
          )
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
          new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, line.length)),
          'หัวข้อควรเว้นวรรคหลังเครื่องหมาย # (เช่น "# About")',
          vscode.DiagnosticSeverity.Warning
        )
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
        'ลิงก์ Markdown ควรเป็นรูปแบบ [ข้อความ](url)',
        vscode.DiagnosticSeverity.Warning
      )
    );
  }

  return diags;
}

function offsetAtLine(s: string, lineIndex: number): number {
  let off = 0, n = 0;
  for (; n < lineIndex && off < s.length; n++) {
    const p = s.indexOf('\n', off);
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
      diags.push(makeDiagRange(doc, start, end, 'ไฟล์ include ควรลงท้ายด้วย .twig', vscode.DiagnosticSeverity.Warning));
    }
  }

  type OpenTag = { kind: 'if' | 'for' | 'block', startIndex: number, token: string };
  const openStack: OpenTag[] = [];
  const tokenRe = /{%\s*(if|for|block)\b|{%\s*end(if|for|block)\s*%}/g;
  let t: RegExpExecArray | null;
  while ((t = tokenRe.exec(text))) {
    if (t[1]) {
      openStack.push({ kind: t[1] as OpenTag['kind'], startIndex: t.index, token: t[0] });
    } else if (t[2]) {
      const kind = t[2] as OpenTag['kind'];
      const top = openStack.pop();
      if (!top || top.kind !== kind) {
        const start = t.index;
        const end = t.index + t[0].length;
        diags.push(makeDiagRange(doc, start, end, `พบ end${kind} ที่ไม่ตรงกับ ${top ? top.kind : 'แท็กเปิด'}`, vscode.DiagnosticSeverity.Error));
      }
    }
  }
  for (const open of openStack) {
    const start = open.startIndex;
    const end = open.startIndex + open.token.length;
    diags.push(makeDiagRange(doc, start, end, `แท็ก ${open.kind} ยังไม่ถูกปิด (missing end${open.kind})`, vscode.DiagnosticSeverity.Error));
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
  severity: vscode.DiagnosticSeverity
) {
  const re = new RegExp(`^\\s*${key}\\s*:`, 'm');
  const m = re.exec(fmBody);
  if (m && typeof m.index === 'number') {
    const abs = fmOffset + m.index;
    const start = doc.positionAt(abs);
    const range = new vscode.Range(start, new vscode.Position(start.line, start.character + key.length));
    const d = new vscode.Diagnostic(range, message, severity);
    d.source = 'pico';
    return d;
  }
  const pos = doc.positionAt(fmOffset);
  const range = new vscode.Range(pos, new vscode.Position(pos.line, pos.character + 1));
  const d = new vscode.Diagnostic(range, message, severity);
  d.source = 'pico';
  return d;
}

function makeDiagRange(
  doc: vscode.TextDocument,
  startOffset: number,
  endOffset: number,
  message: string,
  severity: vscode.DiagnosticSeverity
) {
  const range = new vscode.Range(doc.positionAt(startOffset), doc.positionAt(endOffset));
  const d = new vscode.Diagnostic(range, message, severity);
  d.source = 'pico';
  return d;
}

// ===============================
// Markdown Preview (HTML)
// ===============================
function renderMarkdownToHtml(md: string): string {
  const escape = (s: string) =>
    s.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]!));

  let html = md.replace(/```([\s\S]*?)```/g, (_m, code) => `<pre><code>${escape(code)}</code></pre>`);
  html = html.replace(/^\s*---\s*$/gm, '<hr>');
  html = html.replace(/^\s*>\s?(.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^(?:\s*[-*]\s+.*\n?)+/gm, block => {
    const items = block.trim().split(/\n/).map(line => line.replace(/^\s*[-*]\s+(.*)$/, '<li>$1</li>')).join('');
    return `<ul>${items}</ul>`;
  });
  html = html.replace(/^(?:\s*\d+\.\s+.*\n?)+/gm, block => {
    const items = block.trim().split(/\n/).map(line => line.replace(/^\s*\d+\.\s+(.*)$/, '<li>$1</li>')).join('');
    return `<ol>${items}</ol>`;
  });
  html = html
    .replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+?)`/g, '<code>$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html
    .split(/\n{2,}/)
    .map(p => (/^<h\d|^<pre|^<ul|^<ol|^<blockquote|^<hr/.test(p) ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`))
    .join('\n');

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
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function pickWorkspaceFolder(): Promise<string | undefined> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return undefined;
  if (folders.length === 1) return folders[0].uri.fsPath;
  const picked = await vscode.window.showWorkspaceFolderPick({ placeHolder: 'เลือกโฟลเดอร์โปรเจกต์ Pico' });
  return picked?.uri.fsPath;
}
