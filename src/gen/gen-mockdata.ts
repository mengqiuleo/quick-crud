import { faker } from '@faker-js/faker';
import { Field } from "../type";

function generateSingleMockRow(fields: Field[]): Record<string, any> {
  const row: Record<string, any> = {};
  for (const field of fields) {
    const type = field.type.toLowerCase();
    if (type.includes('number')) { row[field.name] = faker.number.int({ min: 1, max: 999 }); }
    else if (type.includes('string')) { row[field.name] = faker.lorem.sentence(); }
    else if (type.includes('boolean')) { row[field.name] = faker.datatype.boolean(); }
    // else if (type.includes('time') || type.includes('at')) { row[field.name] = faker.date.recent().toISOString(); }
    else if (type.includes('any')) { row[field.name] = faker.word.words({ count: 2 }); }
  }
  return row;
}

export function generateMockDataCode(fields: Field[]): string {
  const mockRows = Array.from({ length: 10 }, () => generateSingleMockRow(fields));

  // 手动转为字符串形式写入 .ts 文件
  const jsonStr = JSON.stringify(mockRows, null, 2);
  return `export const mockData = ${jsonStr};`;
}
