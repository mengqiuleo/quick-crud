import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateConfig } from "../type";

export function getBuiltinTemplates(): TemplateConfig[] {
  return [
    {
      type: 'form',
      name: '内置表单模板',
      path: 'form-default.ejs',
      ext: '.tsx',
      isBuiltin: true,
    },
    {
      type: 'table',
      name: '内置表格模板',
      path: 'table-default.ejs',
      ext: '.tsx',
      isBuiltin: true,
    },
    {
      type: 'table-with-search',
      name: '内置搜索表格模板',
      path: 'table-with-search-default.ejs',
      ext: '.tsx',
      isBuiltin: true,
    },
  ];
}


export function getUserTemplateConfigs(): TemplateConfig[] {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (!workspaceFolder) { return []; }

  const configPath = path.join(workspaceFolder, '.vscode', 'crud-templates', 'config.json');
  if (!fs.existsSync(configPath)) { return []; }

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    vscode.window.showErrorMessage('用户模板 config.json 格式有误');
    return [];
  }
}

export function getAllTemplatesByType(
  type: string,
  context: vscode.ExtensionContext
): TemplateConfig[] {
  const userTemplates = getUserTemplateConfigs().filter(t => t.type === type);
  const builtinTemplates = getBuiltinTemplates().filter(t => t.type === type);
  return [...userTemplates, ...builtinTemplates];
}
