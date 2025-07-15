import { Select } from '@douyinfe/semi-ui';
import { IFieldMeta } from '@lark-base-open/js-sdk';

interface FieldSelectorProps {
  fieldList: IFieldMeta[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function FieldSelector({ fieldList, value, onChange, placeholder }: FieldSelectorProps) {
  return (
    <Select
      style={{ width: 200 }}
      placeholder={placeholder}
      value={value}
      onChange={(val) => onChange(val as string)}
    >
      {fieldList.map(field => (
        <Select.Option key={field.id} value={field.id}>
          {field.name}
        </Select.Option>
      ))}
    </Select>
  );
}