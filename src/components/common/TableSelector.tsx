import { Select } from '@douyinfe/semi-ui';
import { ITableMeta } from '@lark-base-open/js-sdk';

interface TableSelectorProps {
  tableList: ITableMeta[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function TableSelector({ tableList, value, onChange, placeholder }: TableSelectorProps) {
  return (
    <Select
      style={{ width: 200 }}
      placeholder={placeholder}
      value={value}
      onChange={(val) => onChange(val as string)}
    >
      {tableList.map(table => (
        <Select.Option key={table.id} value={table.id}>
          {table.name}
        </Select.Option>
      ))}
    </Select>
  );
}