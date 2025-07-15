import { useState, useCallback, useEffect } from 'react';
import { bitable, ITableMeta, IFieldMeta, IDateTimeField, ITextField, INumberField } from "@lark-base-open/js-sdk";
import { Form, Button, Select } from '@douyinfe/semi-ui';
import useTableData from '../../hooks/useTableData';

interface PersonAnalysisProps {
  tableList: ITableMeta[];
}

export default function PersonAnalysis({ tableList }: PersonAnalysisProps) {
  // 人员分析相关状态
  const [searchTableId, setSearchTableId] = useState<string | undefined>('');
  const [scheduleTableId, setScheduleTableId] = useState<string | undefined>('');
  const [searchStartFieldId, setSearchStartFieldId] = useState<string | undefined>('');
  const [searchEndFieldId, setSearchEndFieldId] = useState<string | undefined>('');

  const [workerStartFieldId, setWorkerStartFieldId] = useState<string | undefined>('');
  const [workerNameFieldId, setWorkerNameFieldId] = useState<string | undefined>('');
  const [personInfoTableId, setPersonInfoTableId] = useState<string | undefined>('');
  const [personNameFieldId, setPersonNameFieldId] = useState<string | undefined>('');
  const [personLevelFieldId, setPersonLevelFieldId] = useState<string | undefined>('');
  const [juniorWorkersFieldId, setJuniorWorkersFieldId] = useState<string | undefined>('');
  const [juniorCountFieldId, setJuniorCountFieldId] = useState<string | undefined>('');
  const [midWorkersFieldId, setMidWorkersFieldId] = useState<string | undefined>('');
  const [midCountFieldId, setMidCountFieldId] = useState<string | undefined>('');
  const [seniorWorkersFieldId, setSeniorWorkersFieldId] = useState<string | undefined>('');
  const [seniorCountFieldId, setSeniorCountFieldId] = useState<string | undefined>('');

  // 使用自定义hook处理表格数据
  const { fields: searchTableFields } = useTableData(searchTableId);
  const { fields: scheduleTableFields } = useTableData(scheduleTableId);
  const { fields: personInfoTableFields } = useTableData(personInfoTableId);


    // 自动匹配字段的函数
    const autoSelectFields = (fields: IFieldMeta[], mappings: Array<{ label: string; setter: (id: string) => void }>) => {
      mappings.forEach(({ label, setter }) => {
        const keyword = label.replace('字段', '').trim();
        const matchedField = fields.find(field => field.name === keyword);
        if (matchedField) {
          setter(matchedField.id);
          console.log(`自动匹配字段: ${label} -> ${matchedField.name} (ID: ${matchedField.id})`);
        }
      });
    };

    // 人员信息表字段映射
    const personInfoMappings = [
      { label: '人员姓名字段', setter: setPersonNameFieldId },
      { label: '人员能力级别字段', setter: setPersonLevelFieldId }
    ];

    // 使用人员表字段映射
    const scheduleMappings = [
      { label: '工作开始时间字段', setter: setWorkerStartFieldId },
      { label: '可用工作人员字段', setter: setWorkerNameFieldId }
    ];

    // 使用检索表字段映射
    const searchMappings = [
      { label: '资源分析开始时间字段', setter: setSearchStartFieldId },
      { label: '资源分析结束时间字段', setter: setSearchEndFieldId },
      { label: '初级人员名单字段', setter: setJuniorWorkersFieldId },
      { label: '初级人员数量字段', setter: setJuniorCountFieldId },
      { label: '中级人员名单字段', setter: setMidWorkersFieldId },
      { label: '中级人员数量字段', setter: setMidCountFieldId },
      { label: '高级人员名单字段', setter: setSeniorWorkersFieldId },
      { label: '高级人员数量字段', setter: setSeniorCountFieldId }
    ];

    // 监听人员信息表字段变化，自动匹配字段
    useEffect(() => {
      if (personInfoTableFields.length > 0) {
        autoSelectFields(personInfoTableFields, personInfoMappings);
      }
    }, [personInfoTableFields]);

    // 监听排班表字段变化
    useEffect(() => {
      if (scheduleTableFields.length > 0) {
        autoSelectFields(scheduleTableFields, scheduleMappings);
      }
    }, [scheduleTableFields]);

    //监听检索表字段变化
    useEffect(() => {
      if (searchTableFields.length > 0) {
        autoSelectFields(searchTableFields, searchMappings);
      }
    }, [searchTableFields]);
  

  // 人员分析核心逻辑
  const handleAnalysis = useCallback<() => Promise<void>>(async () => {
    console.log('开始执行人员检索，当前选中的检索表 ID:', searchTableId, '工作排班人员表 ID:', scheduleTableId);
    // 验证必要参数是否已选择
    if (!searchTableId || !scheduleTableId || !searchStartFieldId || !searchEndFieldId || !workerStartFieldId || !workerNameFieldId || !personInfoTableId || !personNameFieldId || !personLevelFieldId || !juniorWorkersFieldId || !juniorCountFieldId || !midWorkersFieldId || !midCountFieldId || !seniorWorkersFieldId || !seniorCountFieldId) {
      console.log('未选择必要的表或字段，终止检索');
      return;
    }

    // 获取检索表实例及相关字段
    console.log('开始获取检索表记录...');
    const searchTable = await bitable.base.getTableById(searchTableId);
    const searchTableMeta = await bitable.base.getTableMetaById(searchTableId);
    const searchTableName = searchTableMeta.name;
    console.log('成功获取检索表实例，表名:', searchTableName, '表 ID:', searchTableId);

    // 获取检索表所有记录ID列表
    const searchRecordIdList = await searchTable.getRecordIdList();
    console.log('成功获取检索表所有记录 ID 列表，记录数量:', searchRecordIdList.length);

    // 获取检索表的开始时间和结束时间字段实例
    const searchStartField = await searchTable.getField<IDateTimeField>(searchStartFieldId);
    const searchStartFieldMeta = await searchTable.getFieldMetaById(searchStartFieldId);
    const searchStartFieldName = searchStartFieldMeta.name;
    const searchEndField = await searchTable.getField<IDateTimeField>(searchEndFieldId);
    const searchEndFieldMeta = await searchTable.getFieldMetaById(searchEndFieldId);
    const searchEndFieldName = searchEndFieldMeta.name;
    console.log('成功获取检索表时间字段实例，字段名分别为:', searchStartFieldName, searchEndFieldName);

    // 获取排班表实例及相关字段
    const scheduleTable = await bitable.base.getTableById(scheduleTableId);
    const scheduleTableMeta = await bitable.base.getTableMetaById(scheduleTableId);
    const scheduleTableName = scheduleTableMeta.name;
    console.log('成功获取排班表实例，表名:', scheduleTableName, '表 ID:', scheduleTableId);

    const workerStartField = await scheduleTable.getField<IDateTimeField>(workerStartFieldId);
    const workerStartFieldMeta = await scheduleTable.getFieldMetaById(workerStartFieldId);
    const workerStartFieldName = workerStartFieldMeta.name;
    const workerNameField = await scheduleTable.getField<ITextField>(workerNameFieldId);
    const workerNameFieldMeta = await scheduleTable.getFieldMetaById(workerNameFieldId);
    const workerNameFieldName = workerNameFieldMeta.name;
    console.log('成功获取排班表字段实例，字段名分别为:', workerStartFieldName, workerNameFieldName);

    // 获取人员信息表实例及相关字段
    const personInfoTable = await bitable.base.getTableById(personInfoTableId);
    const personInfoTableMeta = await bitable.base.getTableMetaById(personInfoTableId);
    const personInfoTableName = personInfoTableMeta.name;
    console.log('成功获取人员信息表实例，表名:', personInfoTableName, '表 ID:', personInfoTableId);

    const personNameField = await personInfoTable.getField<ITextField>(personNameFieldId);
    const personNameFieldMeta = await personInfoTable.getFieldMetaById(personNameFieldId);
    const personNameFieldName = personNameFieldMeta.name;
    const personLevelField = await personInfoTable.getField<ITextField>(personLevelFieldId);
    const personLevelFieldMeta = await personInfoTable.getFieldMetaById(personLevelFieldId);
    const personLevelFieldName = personLevelFieldMeta.name;
    console.log('成功获取人员信息表字段实例，字段名分别为:', personNameFieldName, personLevelFieldName);

    // 获取人员信息表所有记录并建立姓名到能力级别的映射
    const personRecordIdList = await personInfoTable.getRecordIdList();
    console.log('成功获取人员信息记录 ID 列表，记录数量:', personRecordIdList.length);

    const nameToLevelMap = new Map<string, string>();
    for (const personId of personRecordIdList) {
      const personNameValue = await personNameField.getValue(personId);
      const personLevelValue = await personLevelField.getValue(personId);
      // 处理姓名字段值
      const personNameStr = Array.isArray(personNameValue) ? (personNameValue[0]?.text || '') : (typeof personNameValue === 'object' && personNameValue !== null && 'text' in personNameValue ? (personNameValue as { text: string }).text : String(personNameValue ?? ''));
      // 处理能力级别字段值
      const personLevelStr = Array.isArray(personLevelValue) ? (personLevelValue[0]?.text || '') : (typeof personLevelValue === 'object' && personLevelValue !== null && 'text' in personLevelValue ? (personLevelValue as { text: string }).text : String(personLevelValue ?? ''));
      console.log('人员信息解析结果:', { personId, personNameValue, personLevelValue, parsedName: personNameStr, parsedLevel: personLevelStr });
      if (personNameStr && personNameStr.trim()) {
        nameToLevelMap.set(personNameStr.trim(), personLevelStr.trim());
      }
    }
    console.log('成功建立姓名到能力级别的映射，映射数量:', nameToLevelMap.size);

    // 获取排班表所有记录ID
    const scheduleRecordIdList = await scheduleTable.getRecordIdList();
    console.log('成功获取排班记录 ID 列表，记录数量:', scheduleRecordIdList.length);

    // 遍历检索表中的每条记录
    for (const recordId of searchRecordIdList) {
      console.log('开始处理检索表记录，记录 ID:', recordId);
      const searchRecord = await searchTable.getRecordById(recordId);
      console.log('成功获取检索表记录内容:', searchRecord.fields);

      // 获取当前检索记录的开始和结束时间值
      const [searchStart, searchEnd] = await Promise.all([
        searchStartField.getValue(recordId),
        searchEndField.getValue(recordId)
      ]);
      console.log('获取到的检索开始时间:', searchStart, '检索结束时间:', searchEnd);

      // 跳过时间不完整的记录
      if (!searchStart || !searchEnd) {
        console.log('检索开始时间或结束时间为空，跳过该记录');
        continue;
      }

      // 将检索时间转换为时间戳以便比较
      const searchStartTimestamp = new Date(searchStart).getTime();
      const searchEndTimestamp = new Date(searchEnd).getTime();
      console.log('检索时间戳转换结果:', '开始时间戳:', searchStartTimestamp, '结束时间戳:', searchEndTimestamp);

      // 获取所有排班记录并按开始时间排序
      console.log('开始获取所有排班记录的开始时间...');
      const scheduleRecordsWithTime: Array<{id: string, start: number}> = [];
      for (const scheduleId of scheduleRecordIdList) {
        const startValue = await workerStartField.getValue(scheduleId);
        const startTimestamp = typeof startValue === 'string' ? new Date(startValue).getTime() : startValue;
        scheduleRecordsWithTime.push({ id: scheduleId, start: startTimestamp });
      }
      // 按开始时间戳升序排序
      scheduleRecordsWithTime.sort((a, b) => a.start - b.start);
      console.log('排班记录按开始时间排序完成，排序后的记录数:', scheduleRecordsWithTime.length);

      // 找到最后一条开始时间早于检索开始时间的记录索引
      let lastBeforeIndex = -1;
      for (let i = 0; i < scheduleRecordsWithTime.length; i++) {
        if (scheduleRecordsWithTime[i].start <= searchStartTimestamp) {
          lastBeforeIndex = i;
        } else {
          break;
        }
      }
      console.log('最后一条开始时间早于检索开始时间的记录索引:', lastBeforeIndex);

      // 找到第一条开始时间晚于检索结束时间的记录索引
      let firstAfterIndex = scheduleRecordsWithTime.length;
      for (let i = 0; i < scheduleRecordsWithTime.length; i++) {
        if (scheduleRecordsWithTime[i].start >= searchEndTimestamp) {
          firstAfterIndex = i;
          break;
        }
      }
      console.log('第一条开始时间晚于检索结束时间的记录索引:', firstAfterIndex);

      // 确定中间记录范围
      const middleRecords = scheduleRecordsWithTime.slice(lastBeforeIndex, firstAfterIndex);
      console.log('中间记录范围:', `[${lastBeforeIndex}, ${firstAfterIndex})`, '中间记录数量:', middleRecords.length);

      // 收集中间记录中的所有工作人员姓名（按记录分组）
      const recordWorkerSets: Set<string>[] = [];
      for (const record of middleRecords) {
        console.log('处理中间记录，记录ID:', record.id);
        const workerNameValue = await workerNameField.getValue(record.id);
        console.log('原始工作人员姓名数据:', workerNameValue, '数据类型:', typeof workerNameValue);

        // 处理工作人员姓名字段值
        let workerNameStr = '';
        if (typeof workerNameValue === 'string') {
          workerNameStr = workerNameValue;
        } else if (Array.isArray(workerNameValue)) {
          workerNameStr = workerNameValue.map((segment: any) => segment?.text || '').join('');
        } else if (typeof workerNameValue === 'object' && workerNameValue !== null) {
          workerNameStr = (workerNameValue as { text?: string }).text || '';
        }
        workerNameStr = workerNameStr.trim();

        if (workerNameStr) {
          const normalizedNames = workerNameStr.split(',').map((name: string) => name.trim());
          const uniqueNames = [...new Set(normalizedNames)];
          recordWorkerSets.push(new Set<string>(uniqueNames));
          console.log('从记录中提取到工作人员姓名:', uniqueNames.join(', '));
        } else {
          console.log('工作人员姓名字段为空或格式不支持');
          recordWorkerSets.push(new Set<string>());
        }
      }

      // 计算所有记录工作人员姓名集合的交集
      let uniqueWorkers: string[] = [];
      if (recordWorkerSets.length > 0) {
        uniqueWorkers = Array.from(recordWorkerSets.reduce<Set<string>>((acc, set) => {
          return new Set([...acc].filter(x => set.has(x)));
        }, recordWorkerSets[0]));
      }
      console.log('所有记录的人员交集:', uniqueWorkers);

      // 根据能力级别分类统计人员
      const juniorWorkers: string[] = [];
      const midWorkers: string[] = [];
      const seniorWorkers: string[] = [];

      for (const worker of uniqueWorkers) {
        const level = nameToLevelMap.get(worker);
        if (level === '初级') {
          juniorWorkers.push(worker);
        } else if (level === '中级') {
          midWorkers.push(worker);
        } else if (level === '高级') {
          seniorWorkers.push(worker);
        }
      }

      console.log('人员能力级别分类统计结果: 初级(', juniorWorkers.length, '):', juniorWorkers.join(', '), '; 中级(', midWorkers.length, '):', midWorkers.join(', '), '; 高级(', seniorWorkers.length, '):', seniorWorkers.join(', '));

      // 获取检索表的各结果字段实例
      const juniorWorkersField = await searchTable.getField<ITextField>(juniorWorkersFieldId);
      const juniorCountField = await searchTable.getField<INumberField>(juniorCountFieldId);
      const midWorkersField = await searchTable.getField<ITextField>(midWorkersFieldId);
      const midCountField = await searchTable.getField<INumberField>(midCountFieldId);
      const seniorWorkersField = await searchTable.getField<ITextField>(seniorWorkersFieldId);
      const seniorCountField = await searchTable.getField<INumberField>(seniorCountFieldId);

      // 写入分类统计结果到检索表
      await Promise.all([
        juniorWorkersField.setValue(recordId, juniorWorkers.join(', ')),
        juniorCountField.setValue(recordId, juniorWorkers.length),
        midWorkersField.setValue(recordId, midWorkers.join(', ')),
        midCountField.setValue(recordId, midWorkers.length),
        seniorWorkersField.setValue(recordId, seniorWorkers.join(', ')),
        seniorCountField.setValue(recordId, seniorWorkers.length)
      ]);

      console.log('人员检索结果写入成功，结果:', uniqueWorkers.join(', '));
      console.log('姓名-能力级别映射表:', Array.from(nameToLevelMap.entries()));
      console.log('人员能力级别分类统计结果写入成功');
    }
  }, [searchTableId, scheduleTableId, searchStartFieldId, searchEndFieldId, workerStartFieldId, workerNameFieldId, personInfoTableId, personNameFieldId, personLevelFieldId, juniorWorkersFieldId, juniorCountFieldId, midWorkersFieldId, midCountFieldId, seniorWorkersFieldId, seniorCountFieldId]);

  return (
    <Form<{}> labelPosition='top' style={{ maxWidth: 800, margin: '0 auto' }}>
      <h4>1. 选择人员信息表</h4>
      <Form.Slot>
          <Select
            value={personInfoTableId}
            onChange={(value) => setPersonInfoTableId(value as string)}
            placeholder="请选择人员信息表"
          >
            {tableList.map(({ name, id }) => (
              <Select.Option key={id} value={id}>{name}</Select.Option>
            ))}
          </Select>
        </Form.Slot>
        {personInfoTableId && (
          <>
            <Form.Slot>
              <Select
                value={personNameFieldId}
                onChange={(value) => setPersonNameFieldId(value as string)}
                placeholder="请选择人员姓名字段"
              >
                {personInfoTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
            <Form.Slot>
              <Select
                value={personLevelFieldId}
                onChange={(value) => setPersonLevelFieldId(value as string)}
                placeholder="请选择人员能力级别字段"
              >
                {personInfoTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          </>
        )}
        <hr className="form-divider"/>
        <h4>2. 选择人员排班表</h4>
        <Form.Slot>
          <Select
            value={scheduleTableId}
            onChange={(value) => setScheduleTableId(value as string)}
            placeholder="请选择人员排班表"
          >
            {tableList.map(({ name, id }) => (
              <Select.Option key={id} value={id}>{name}</Select.Option>
            ))}
          </Select>
        </Form.Slot>
        {scheduleTableId && ( 
          <>
            <Form.Slot>
              <Select
                value={workerStartFieldId}
                onChange={(value) => setWorkerStartFieldId(value as string)}
                placeholder="请选择工作开始时间字段"
              >
                {scheduleTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>

            <Form.Slot>
              <Select
                value={workerNameFieldId}
                onChange={(value) => setWorkerNameFieldId(value as string)}
                placeholder="请选择可用工作人员字段"
              >
                {scheduleTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          </>
        )}
        <hr className="form-divider"/>
        <h4>3. 选择资源总量分析表</h4>
        <Form.Slot>
          <Select
            value={searchTableId}
            onChange={(value) => setSearchTableId(value as string)}
            placeholder="请选择资源总量分析表"
          >
            {tableList.map(({ name, id }) => (
              <Select.Option key={id} value={id}>{name}</Select.Option>
            ))}
          </Select>
        </Form.Slot>
        {searchTableId && (
          <>
            <Form.Slot>
              <Select
                value={searchStartFieldId}
                onChange={(value) => setSearchStartFieldId(value as string)}
                placeholder="请选择分析开始时间字段"
              >
                {searchTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
            <Form.Slot>
              <Select
                value={searchEndFieldId}
                onChange={(value) => setSearchEndFieldId(value as string)}
                placeholder="请选择分析结束时间字段"
              >
                {searchTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
<Form.Slot>
              <Select
                value={juniorWorkersFieldId}
                onChange={(value) => setJuniorWorkersFieldId(value as string)}
                placeholder="请选择初级人员名单字段"
              >
                {searchTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
            <Form.Slot>
              <Select
                value={juniorCountFieldId}
                onChange={(value) => setJuniorCountFieldId(value as string)}
                placeholder="请选择初级人员数量字段"
              >
                {searchTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
            <Form.Slot>
              <Select
                value={midWorkersFieldId}
                onChange={(value) => setMidWorkersFieldId(value as string)}
                placeholder="请选择中级人员名单字段"
              >
                {searchTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
            <Form.Slot>
              <Select
                value={midCountFieldId}
                onChange={(value) => setMidCountFieldId(value as string)}
                placeholder="请选择中级人员数量字段"
              >
                {searchTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
            <Form.Slot>
              <Select
                value={seniorWorkersFieldId}
                onChange={(value) => setSeniorWorkersFieldId(value as string)}
                placeholder="请选择高级人员名单字段"
              >
                {searchTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
            <Form.Slot>
              <Select
                value={seniorCountFieldId}
                onChange={(value) => setSeniorCountFieldId(value as string)}
                placeholder="请选择高级人员数量字段"
              >
                {searchTableFields.map(({ name, id }) => (
                  <Select.Option key={id} value={id}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          </>
        )}
        <hr className="form-divider"/><br/>
        <Button theme='solid' onClick={handleAnalysis}>开始执行分析</Button>
    </Form>
  );
}