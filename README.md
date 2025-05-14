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

![screen.gif](/resources/screen.gif)

生成的文件包括：
  - columns.ts
  - mockData.ts
  - 模板文件


### 自定义模板
需要在项目的 .vscode 文件夹下，声明一个 crud-templates 文件夹进行配置。

文件夹中需要配置一个 config.json 文件，自定义的 ejs 模板与 config.json 文件同级。config.json 的格式如下：

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

#### 自定义模板举例
``` tsx
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
需要特别关注的是：


## TODO
- [ ] 支持代码模板保存在 Github 等远程仓库
- [ ] 支持团队和使用
- [ ] 改进用户模板声明方式，目前使用 ejs 模板用户定义有些成本

<br />

**Enjoy!**
