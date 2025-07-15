import { useState, useEffect } from 'react';
import { bitable, IFieldMeta } from '@lark-base-open/js-sdk';

export default function useTableData(tableId: string | undefined) {
  const [fields, setFields] = useState<IFieldMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tableId) {
      setFields([]);
      return;
    }

    const fetchFields = async () => {
      setLoading(true);
      setError(null);
      try {
        const table = await bitable.base.getTableById(tableId);
        const fieldMetaList = await table.getFieldMetaList();
        setFields(fieldMetaList);
      } catch (err) {
        setError('获取字段列表失败: ' + (err instanceof Error ? err.message : String(err)));
        console.error('获取字段列表失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [tableId]);

  return { fields, loading, error };
}