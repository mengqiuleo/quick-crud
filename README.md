# quick-crud

基于选中的 TypeScript 类型定义，一键生成完整的可运行、可调试的前端页面代码（CRUD 表单、表格、查询页等）

## 功能
- 内置三种常用页面模板（表单、表格、表格+搜索）
- 支持用户自定义模板
- 可生成表格的 Mock 数据
- 一键生成可运行、可调试页面
- 支持右键菜单 / 快捷键 触发


## 使用

### 直接使用内置模板
PS: 内置模板目前只支持 react + antd 

- 在生成 table 和 table-with-search 模板时，会让用户选择需要展示的 columns
- 在生成 table-with-search 模板时，会让用户选择需要展示的「搜索参数」
![screen.gif](/resources/screen.gif)


生成的文件包括：
  - columns.ts
  - mockData.ts
  - 模板文件(.tsx or .vue)


### 自定义模板
需要在项目的 .vscode 文件夹下，声明一个 crud-templates 文件夹进行配置。

文件夹中需要配置一个 config.json 文件，自定义的 ejs 模板与 config.json 文件同级。
![screen.gif](/resources/config.jpg)

config.json 的格式如下：

```json
[
  {
    "type": "table-with-search", 
    "name": "ERP-搜索表格模板",
    "path": "table-with-search.ejs",
    "ext": ".tsx"
  }
]
```
- type: 模板类型，目前支持三种模板类型（form, table, table-with-search）
- name: 模板名称
- path: 模板所在路径，模板和 config.json 同级
- ext: 模板后缀类型（`ext: '.tsx' | '.vue'`）

#### 关于自定义模板的说明
1. 该插件会自动生成 columns.ts 和 mockData.ts 文件，所以需要在模板中顶部引入
``` tsx
// table
import { columns } from './columns';
import { mockData } from './mockData';

<Table rowKey="id" columns={columns} dataSource={dataSource} />
```

2. 关于 form 模板的字段和 table-with-search 模板的搜索字段
（这里的设计并不好，这个插件几乎只有自己用，所以改进还排不上）

在自定义 ejs 模板时，可能需要关注的就是如何动态选择代码中的 form 表单展示哪些字段， table-with-search 展示哪些搜索字段。

这里给两个模板示例，自定义时直接复制 ejs 部分即可，该插件内部会处理。
```tsx
// form
import { Form, Input, InputNumber, Switch, Select, Button } from 'antd';

export const CRUDPage = () => {
const [form] = Form.useForm();

return (
<Form form={form} layout="vertical">
  <% fields.forEach(field=> { %>
    <Form.Item label="<%= field.name %>" name="<%= field.name %>">
      <%- field.component %>
    </Form.Item>
    <% }); %>
      <Form.Item>
        <Button type="primary" htmlType="submit">提交</Button>
      </Form.Item>
</Form>
);
};
```



``` tsx
// table-with-search
import { Table, Form, Input, InputNumber, Switch, Select, Button } from 'antd';
import { useState } from 'react';
import { columns } from './columns';
import { mockData } from './mockData';

export const CRUDPage = () => {
const [form] = Form.useForm();
const [dataSource, setDataSource] = useState(mockData);


const onSearch = () => {
const values = form.getFieldsValue();
console.log('搜索参数:', values);
};

return (
<>
  <Form form={form} layout="inline" onFinish={onSearch} style={{ marginBottom: 16 }}>
    <% searchFields.forEach(field=> { %>
      <Form.Item label="<%= field.name %>" name="<%= field.name %>">
        <%- field.component %>
      </Form.Item>
      <% }); %>
        <Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
          <Button size="small" htmlType="submit">重置</Button>
        </Form.Item>
  </Form>

  <Table rowKey="id" columns={columns} dataSource={dataSource} />
</>
);
};
```
**fields 和 searchFields 说明**
这两个字段类型均为：
```ts
export interface Field {
  name: string; // 根据 ts 类型的 key 生成
  type: string; // 根据 ts 类型的 value 生成
  component?: string; // 根据 ts 类型的 value，自动匹配对应的组件
}
```
- string: `<Input/>`
- number: `<InputNumber/>`
- enum: `<Select />`
- boolean: `<Switch />`

## TODO
- [ ] 支持代码模板保存在 Github 等远程仓库
- [ ] 支持团队和使用
- [ ] 改进用户模板声明方式，目前使用 ejs 模板用户定义有些成本

<br />

**Enjoy!**
