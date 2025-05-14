export interface TemplateConfig {
  type: string;            // form / table / table-with-search
  name: string;            // 模板名称，用于展示选择项
  path: string;            // 相对路径（用户路径 or 插件路径）
  ext: '.tsx' | '.vue';    // 输出扩展名
  isBuiltin?: boolean;     // 是否为插件内置模板（用于路径拼接）
}

export interface Field {
  name: string;
  type: string;
  component?: string; // 自动匹配 Input、Select 等
  mock?: string;       // 生成 mock 数据
}
