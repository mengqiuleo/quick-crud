import { Field } from "../type";

export function genColumnsCode(fields: Field[]): string {
  // antd antd-vue 已支持，vue 组件库不需要 columns
  return `export const columns = [\n${fields.map(field => {
    return `  {
    title: '${field.name}',
    dataIndex: '${field.name}',
    key: '${field.name}'
  }`;
  }).join(',\n')}\n];`;
}