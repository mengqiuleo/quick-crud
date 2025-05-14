
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Field } from './type';


function getComponentByType(type: string): string {
  if (type.includes('string')) { return '<Input />'; }
  if (type.includes('number')) { return '<InputNumber />'; }
  if (type.includes('boolean')) { return '<Switch />'; }
  if (type.includes('enum')) { return '<Select options={[]} />'; }
  return '<Input />';
}

function getMockByType(type: string): string {
  if (type.includes('string')) { return '示例文本'; }
  if (type.includes('number')) { return '123'; }
  if (type.includes('boolean')) { return 'true'; }
  return '示例值';
}


export function parseFieldsFromType(typeText: string): Field[] {
  // 提取大括号中的字段定义
  const bodyMatch = typeText.match(/\{([\s\S]*?)\}/);
  if (!bodyMatch) {
    return [];
  }

  // const fieldRegex = /\/\*\*\s*(.*?)\s*\*\/\s*(\w+):\s*([\w\[\]\|]+)[;,]?/g;
  const fieldRegex = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?(\w+)\s*:\s*([^;,\n]+)/g;
  const fields: Field[] = [];

  let match;
  while ((match = fieldRegex.exec(typeText))) {
    const label = match[1]?.trim();
    const name = match[2];
    const type = match[3].trim();

    fields.push({
      name,
      // label,
      type,
      component: getComponentByType(type),
      // mock: getMockByType(type),
    });
  }

  return fields;
}

// export function tsTypeToAntdColumns(typeCode: string): string {
//   // 提取大括号中的字段定义
//   const bodyMatch = typeCode.match(/\{([\s\S]*?)\}/);
//   if (!bodyMatch) {
//     return '[]';
//   }

//   const body = bodyMatch[1];

//   // 提取字段定义（支持 /** 注释 */）
//   const fieldRegex = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?(\w+)\s*:\s*([^;,\n]+)/g;

//   const columns = [];
//   let match;
//   while ((match = fieldRegex.exec(body))) {
//     const comment = match[1]?.trim();
//     const name = match[2];
//     const type = match[3].trim();

//     columns.push({
//       title: comment || autoLabel(name),
//       dataIndex: name,
//       key: name,
//     });
//   }

//   return `const columns = [\n${columns
//     .map(
//       (col) =>
//         `  {\n    title: "${col.title}",\n    dataIndex: "${col.dataIndex}",\n    key: "${col.key}"\n  }`
//     )
//     .join(',\n')}\n];`;
// }

// // 简单根据字段名生成 label（可替换为更智能的命名规则或中英文映射）
// function autoLabel(name: string): string {
//   return name
//     .replace(/([A-Z])/g, ' $1')
//     .replace(/^./, (s) => s.toUpperCase())
//     .trim();
// }

export function getTemplatePath(context: vscode.ExtensionContext, template: string): string {
  const userTemplatePath = vscode.workspace.workspaceFolders
    ? path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'crud-templates', `${template}.ejs`)
    : '';
  const builtinTemplatePath = path.join(context.extensionPath, 'templates', `${template}.ejs`);

  console.log(builtinTemplatePath);
  return fs.existsSync(userTemplatePath) ? userTemplatePath : builtinTemplatePath;
}


export async function writeFileNextToCurrentEditor(filename: string, content: string) {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage('没有打开的编辑器窗口');
    return;
  }

  // 获取当前文件所在目录
  const currentFileUri = activeEditor.document.uri;
  const currentFileDir = path.dirname(currentFileUri.fsPath);

  // 拼接目标文件路径
  const targetFilePath = path.join(currentFileDir, filename);

  // 写入文件
  fs.writeFileSync(targetFilePath, content, 'utf8');

  // 打开写入的文件
  const newDoc = await vscode.workspace.openTextDocument(targetFilePath);
  vscode.window.showTextDocument(newDoc);
}