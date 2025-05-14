import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

import { parseFieldsFromType, writeFileNextToCurrentEditor } from './utils';
import { getAllTemplatesByType } from './gen/gen-template';
import { TemplateConfig } from './type';
import { genColumnsCode } from './gen/gen-columns';
import { generateMockDataCode } from './gen/gen-mockdata';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerTextEditorCommand('quick-crud.generateFromType', async () => {

		const editor = vscode.window.activeTextEditor;
		if (editor?.selection.isEmpty) {
			vscode.window.showErrorMessage('请先选择 TS 类型片段!');
		}

		let text = editor?.document.getText(editor.selection);

		const fields = parseFieldsFromType(text || '');

		const templateType = await vscode.window.showQuickPick(
			['form', 'table', 'table-with-search'],
			{ placeHolder: '请选择生成模板类型' }
		);
		if (!templateType) { return; }

		const allTemplates = getAllTemplatesByType(templateType, context);

		if (allTemplates.length === 0) {
			vscode.window.showErrorMessage(`没有找到类型为 ${templateType} 的模板`);
			return;
		}

		let selectedTemplate: TemplateConfig;
		if (allTemplates.length === 1) {
			selectedTemplate = allTemplates[0];
		} else {
			const selectedName = await vscode.window.showQuickPick(
				allTemplates.map(t => t.name),
				{ placeHolder: '请选择具体模板' }
			);
			selectedTemplate = allTemplates.find(t => t.name === selectedName)!;
		}

		let searchFieldNames: string[] = [];
		let tableFieldNames: string[] = [];

		if (templateType === 'table-with-search') {
			const search = await vscode.window.showQuickPick(
				fields.map(f => f.name),
				{ canPickMany: true, placeHolder: '选择作为搜索字段的字段' }
			);
			if (!search) { return; }
			searchFieldNames = search;
		}

		if (templateType === 'table' || templateType === 'table-with-search') {
			const table = await vscode.window.showQuickPick(
				fields.map(f => f.name),
				{ canPickMany: true, placeHolder: '选择展示在 Table 的字段' }
			);
			if (!table) { return; }
			tableFieldNames = table;
		}

		const searchFields = fields.filter(f => searchFieldNames.includes(f.name));
		const tableColumns = fields.filter(f => tableFieldNames.includes(f.name));

		const templatePath = selectedTemplate.isBuiltin
			? path.join(context.extensionPath, 'templates', selectedTemplate.path)
			: path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, '.vscode', 'crud-templates', selectedTemplate.path);

		const templateContent = fs.readFileSync(templatePath, 'utf-8');

		const result = ejs.render(templateContent, {
			fields,
			searchFields,
			tableColumns,
		});

		const mockData = generateMockDataCode(fields);
		// const mockDataDoc = await vscode.workspace.openTextDocument({
		// 	language: 'typescript',
		// 	content: mockData,
		// });

		const columns = genColumnsCode(tableColumns);
		// const columnsDoc = await vscode.workspace.openTextDocument({
		// 	language: 'typescript',
		// 	content: columns,
		// });

		// const doc = await vscode.workspace.openTextDocument({
		// 	language: 'typescriptreact',
		// 	content: result,
		// });

		// vscode.window.showTextDocument(doc);
		// vscode.window.showTextDocument(mockDataDoc);
		// vscode.window.showTextDocument(columnsDoc);

		await writeFileNextToCurrentEditor('mockData.ts', mockData);
		await writeFileNextToCurrentEditor('columns.ts', columns);
		await writeFileNextToCurrentEditor(`Template.${selectedTemplate.ext}`, result);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
