import { useState, useCallback, useEffect } from 'react';
import { bitable, ITableMeta, IFieldMeta, IDateTimeField, ITextField, INumberField } from "@lark-base-open/js-sdk";
import { Form, Button, Select } from '@douyinfe/semi-ui';
import useTableData from '../../hooks/useTableData';

interface DeviceAnalysisProps {
  tableList: ITableMeta[];
}

export default function DeviceAnalysis({ tableList }: DeviceAnalysisProps) {
  // 设备分析相关状态
  const [deviceInfoTableId, setDeviceInfoTableId] = useState<string | undefined>('');
  const [deviceIdFieldId, setDeviceIdFieldId] = useState<string | undefined>('');
  const [deviceTypeFieldId, setDeviceTypeFieldId] = useState<string | undefined>('');
  const [deviceScheduleTableId, setDeviceScheduleTableId] = useState<string | undefined>('');
  const [deviceUseTimeFieldId, setDeviceUseTimeFieldId] = useState<string | undefined>('');
  const [deviceScheduleDeviceIdFieldId, setDeviceScheduleDeviceIdFieldId] = useState<string | undefined>('');
  const [dataAnalysisTableId, setDataAnalysisTableId] = useState<string | undefined>('');
  const [analysisStartTimeFieldId, setAnalysisStartTimeFieldId] = useState<string | undefined>('');
  const [analysisEndTimeFieldId, setAnalysisEndTimeFieldId] = useState<string | undefined>('');

  const [displayListFieldId, setDisplayListFieldId] = useState<string>('');
  const [displayCountFieldId, setDisplayCountFieldId] = useState<string>('');
  const [flipComputerListFieldId, setFlipComputerListFieldId] = useState<string>('');
  const [flipComputerCountFieldId, setFlipComputerCountFieldId] = useState<string>('');
  const [highPerfComputerListFieldId, setHighPerfComputerListFieldId] = useState<string>('');
  const [highPerfComputerCountFieldId, setHighPerfComputerCountFieldId] = useState<string>('');

  // 使用自定义hook处理表格数据
  const { fields: deviceInfoTableFields } = useTableData(deviceInfoTableId);
  const { fields: deviceScheduleTableFields } = useTableData(deviceScheduleTableId);
  const { fields: dataAnalysisTableFields } = useTableData(dataAnalysisTableId);

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

  // 设备信息表字段映射
  const deviceInfoMappings = [
    { label: '设备编号字段', setter: setDeviceIdFieldId },
    { label: '设备类型字段', setter: setDeviceTypeFieldId }
  ];

  // 设备排期表字段映射
  const deviceScheduleMappings = [
    { label: '设备使用时间字段', setter: setDeviceUseTimeFieldId },
    { label: '可用设备列表字段', setter: setDeviceScheduleDeviceIdFieldId }
  ];

  // 数据分析表字段映射
  const dataAnalysisMappings = [
    { label: '资源分析开始时间字段', setter: setAnalysisStartTimeFieldId },
    { label: '资源分析结束时间字段', setter: setAnalysisEndTimeFieldId },
    { label: '显示器清单字段', setter: setDisplayListFieldId },
    { label: '显示器数量字段', setter: setDisplayCountFieldId },
    { label: '翻页电脑清单字段', setter: setFlipComputerListFieldId },
    { label: '翻页电脑数量字段', setter: setFlipComputerCountFieldId },
    { label: '高性能电脑清单字段', setter: setHighPerfComputerListFieldId },
    { label: '高性能电脑数量字段', setter: setHighPerfComputerCountFieldId }
  ];

  // 监听设备信息表字段变化，自动匹配字段
  useEffect(() => {
    if (deviceInfoTableFields.length > 0) {
      autoSelectFields(deviceInfoTableFields, deviceInfoMappings);
    }
  }, [deviceInfoTableFields]);

  // 监听设备排期表字段变化
  useEffect(() => {
    if (deviceScheduleTableFields.length > 0) {
      autoSelectFields(deviceScheduleTableFields, deviceScheduleMappings);
    }
  }, [deviceScheduleTableFields]);

  // 监听数据分析表字段变化
  useEffect(() => {
    if (dataAnalysisTableFields.length > 0) {
      autoSelectFields(dataAnalysisTableFields, dataAnalysisMappings);
    }
  }, [dataAnalysisTableFields]);

  // 设备分析核心逻辑
  /**
   * 设备分析主函数 - 根据选择的时间范围和表格数据，分析符合条件的设备并写入结果
   * 1. 获取设备信息表和排期表数据
   * 2. 根据时间戳排序排期记录
   * 3. 确定中间记录范围并收集设备编号交集
   * 4. 按设备类型（显示器、翻页电脑、高性能电脑）分类统计
   * 5. 将结果写入数据分析表
   */
  const handleAnalysis = useCallback<() => Promise<void>>(async () => {
    console.log('开始执行设备检索，当前选中的设备信息表 ID:', deviceInfoTableId, '设备排期表 ID:', deviceScheduleTableId, '数据分析表 ID:', dataAnalysisTableId);
    // 验证必要参数是否已选择
    if (!deviceInfoTableId || !deviceScheduleTableId || !dataAnalysisTableId || !deviceIdFieldId || !deviceTypeFieldId ||
        !deviceUseTimeFieldId || !deviceScheduleDeviceIdFieldId || !analysisStartTimeFieldId || !analysisEndTimeFieldId ||
        !displayListFieldId || !displayCountFieldId || !flipComputerListFieldId ||
        !flipComputerCountFieldId || !highPerfComputerListFieldId || !highPerfComputerCountFieldId) {
      console.log('未选择必要的表或字段，终止检索，当前各值为：', {
        deviceInfoTableId, deviceScheduleTableId, dataAnalysisTableId, deviceIdFieldId, deviceTypeFieldId,
        deviceUseTimeFieldId, deviceScheduleDeviceIdFieldId, analysisStartTimeFieldId, analysisEndTimeFieldId,
        displayListFieldId, displayCountFieldId, flipComputerListFieldId,
        flipComputerCountFieldId, highPerfComputerListFieldId, highPerfComputerCountFieldId
      });
      return;
    }

    // 获取数据分析表实例及相关字段
    console.log('开始获取数据分析表记录...');
    const dataAnalysisTable = await bitable.base.getTableById(dataAnalysisTableId);
    const dataAnalysisTableMeta = await bitable.base.getTableMetaById(dataAnalysisTableId);
    const dataAnalysisTableName = dataAnalysisTableMeta.name;
    console.log('成功获取数据分析表实例，表名:', dataAnalysisTableName, '表 ID:', dataAnalysisTableId);

    // 获取数据分析表所有记录ID列表
    const dataAnalysisRecordIdList = await dataAnalysisTable.getRecordIdList();
    console.log('成功获取数据分析表所有记录 ID 列表，记录数量:', dataAnalysisRecordIdList.length);

    // 获取分析开始时间和结束时间字段实例
    const analysisStartField = await dataAnalysisTable.getField<IDateTimeField>(analysisStartTimeFieldId);
    const analysisStartFieldMeta = await dataAnalysisTable.getFieldMetaById(analysisStartTimeFieldId);
    const analysisStartFieldName = analysisStartFieldMeta.name;
    const analysisEndField = await dataAnalysisTable.getField<IDateTimeField>(analysisEndTimeFieldId);
    const analysisEndFieldMeta = await dataAnalysisTable.getFieldMetaById(analysisEndTimeFieldId);
    const analysisEndFieldName = analysisEndFieldMeta.name;
    console.log('成功获取分析时间字段实例，字段名分别为:', analysisStartFieldName, analysisEndFieldName);

    // 获取设备排期表实例及相关字段
    const deviceScheduleTable = await bitable.base.getTableById(deviceScheduleTableId);
    const deviceScheduleTableMeta = await bitable.base.getTableMetaById(deviceScheduleTableId);
    const deviceScheduleTableName = deviceScheduleTableMeta.name;
    console.log('成功获取设备排期表实例，表名:', deviceScheduleTableName, '表 ID:', deviceScheduleTableId);

    const deviceUseTimeField = await deviceScheduleTable.getField<IDateTimeField>(deviceUseTimeFieldId);
    const deviceUseTimeFieldMeta = await deviceScheduleTable.getFieldMetaById(deviceUseTimeFieldId);
    const deviceUseTimeFieldName = deviceUseTimeFieldMeta.name;
    const deviceScheduleDeviceIdField = await deviceScheduleTable.getField<ITextField>(deviceScheduleDeviceIdFieldId);
    const deviceScheduleDeviceIdFieldMeta = await deviceScheduleTable.getFieldMetaById(deviceScheduleDeviceIdFieldId);
    const deviceScheduleDeviceIdFieldName = deviceScheduleDeviceIdFieldMeta.name;
    console.log('成功获取设备排期表字段实例，字段名分别为:', deviceUseTimeFieldName, deviceScheduleDeviceIdFieldName);

    // 获取设备信息表实例及相关字段
    const deviceInfoTable = await bitable.base.getTableById(deviceInfoTableId);
    const deviceInfoTableMeta = await bitable.base.getTableMetaById(deviceInfoTableId);
    const deviceInfoTableName = deviceInfoTableMeta.name;
    console.log('成功获取设备信息表实例，表名:', deviceInfoTableName, '表 ID:', deviceInfoTableId);

    const deviceIdField = await deviceInfoTable.getField<ITextField>(deviceIdFieldId);
    const deviceIdFieldMeta = await deviceInfoTable.getFieldMetaById(deviceIdFieldId);
    const deviceIdFieldName = deviceIdFieldMeta.name;
    const deviceTypeField = await deviceInfoTable.getField<ITextField>(deviceTypeFieldId);
    const deviceTypeFieldMeta = await deviceInfoTable.getFieldMetaById(deviceTypeFieldId);
    const deviceTypeFieldName = deviceTypeFieldMeta.name;
    console.log('成功获取设备信息表字段实例，字段名分别为:', deviceIdFieldName, deviceTypeFieldName);

    // 获取设备信息表所有记录并建立设备编号到类型的映射
    const deviceRecordIdList = await deviceInfoTable.getRecordIdList();
    console.log('成功获取设备信息记录 ID 列表，记录数量:', deviceRecordIdList.length);

    const deviceIdToTypeMap = new Map<string, string>();
    for (const deviceId of deviceRecordIdList) {
      const deviceIdValue = await deviceIdField.getValue(deviceId);
      const deviceTypeValue = await deviceTypeField.getValue(deviceId);
      // 处理设备编号和类型字段值
      const deviceIdStr = Array.isArray(deviceIdValue) ? (deviceIdValue[0]?.text || '') : (typeof deviceIdValue === 'object' && deviceIdValue !== null && 'text' in deviceIdValue ? (deviceIdValue as { text: string }).text : String(deviceIdValue ?? ''));
      const deviceTypeStr = Array.isArray(deviceTypeValue) ? (deviceTypeValue[0]?.text || '') : (typeof deviceTypeValue === 'object' && deviceTypeValue !== null && 'text' in deviceTypeValue ? (deviceTypeValue as { text: string }).text : String(deviceTypeValue ?? ''));
      console.log('设备信息解析结果:', { deviceId, deviceIdValue, deviceTypeValue, parsedId: deviceIdStr, parsedType: deviceTypeStr });
      if (deviceIdStr && deviceIdStr.trim()) {
        deviceIdToTypeMap.set(deviceIdStr.trim().toLowerCase(), deviceTypeStr.trim());
      }
    }
    console.log('成功建立设备编号到类型的映射，映射数量:', deviceIdToTypeMap.size);

    // 获取设备排期表所有记录ID
    const scheduleRecordIdList = await deviceScheduleTable.getRecordIdList();
    console.log('成功获取设备排期记录 ID 列表，记录数量:', scheduleRecordIdList.length);

    // 遍历数据分析表中的每条记录
    for (const recordId of dataAnalysisRecordIdList) {
      console.log('开始处理数据分析表记录，记录 ID:', recordId);
      const analysisRecord = await dataAnalysisTable.getRecordById(recordId);
      console.log('成功获取数据分析表记录内容:', analysisRecord.fields);

      // 获取当前分析记录的开始和结束时间值
      const [analysisStart, analysisEnd] = await Promise.all([
        analysisStartField.getValue(recordId),
        analysisEndField.getValue(recordId)
      ]);
      console.log('获取到的分析开始时间:', analysisStart, '分析结束时间:', analysisEnd);

      // 跳过时间不完整的记录
      if (!analysisStart || !analysisEnd) {
        console.log('分析开始时间或结束时间为空，跳过该记录');
        continue;
      }

      // 将分析时间转换为时间戳以便比较
      const analysisStartTimestamp = new Date(analysisStart).getTime();
      const analysisEndTimestamp = new Date(analysisEnd).getTime();
      console.log('分析时间戳转换结果:', '开始时间戳:', analysisStartTimestamp, '结束时间戳:', analysisEndTimestamp);

      // 获取所有排期记录并按开始时间排序
      console.log('开始获取所有排期记录的开始时间...');
      const scheduleRecordsWithTime: Array<{id: string, start: number}> = [];
      for (const scheduleId of scheduleRecordIdList) {
        const startValue = await deviceUseTimeField.getValue(scheduleId);
        const startTimestamp = typeof startValue === 'string' ? new Date(startValue).getTime() : startValue;
        scheduleRecordsWithTime.push({ id: scheduleId, start: startTimestamp });
      }
      // 按开始时间戳升序排序
      scheduleRecordsWithTime.sort((a, b) => a.start - b.start);
      console.log('排期记录按开始时间排序完成，排序后的记录数:', scheduleRecordsWithTime.length);

      // 找到最后一条开始时间早于分析开始时间的记录索引
      let lastBeforeIndex = -1;
      for (let i = 0; i < scheduleRecordsWithTime.length; i++) {
        if (scheduleRecordsWithTime[i].start <= analysisStartTimestamp) {
          lastBeforeIndex = i;
        } else {
          break;
        }
      }
      console.log('最后一条开始时间早于分析开始时间的记录索引:', lastBeforeIndex);

      // 找到第一条开始时间晚于分析结束时间的记录索引
      let firstAfterIndex = scheduleRecordsWithTime.length;
      for (let i = 0; i < scheduleRecordsWithTime.length; i++) {
        if (scheduleRecordsWithTime[i].start >= analysisEndTimestamp) {
          firstAfterIndex = i;
          break;
        }
      }
      console.log('第一条开始时间晚于分析结束时间的记录索引:', firstAfterIndex);

      // 确定中间记录范围
      const middleRecords = scheduleRecordsWithTime.slice(lastBeforeIndex, firstAfterIndex);
      console.log('中间记录范围:', `[${lastBeforeIndex}, ${firstAfterIndex})`, '中间记录数量:', middleRecords.length);

      // 收集中间记录中的所有设备编号（按记录分组）
      const recordDeviceSets: Set<string>[] = [];
      for (const record of middleRecords) {
        console.log('处理中间记录，记录ID:', record.id);
        const deviceIdValue = await deviceScheduleDeviceIdField.getValue(record.id);
        console.log('原始设备编号数据:', deviceIdValue, '数据类型:', typeof deviceIdValue);

        // 处理设备编号字段值
        let deviceIdStr = '';
        if (typeof deviceIdValue === 'string') {
          deviceIdStr = deviceIdValue;
        } else if (Array.isArray(deviceIdValue)) {
          deviceIdStr = deviceIdValue.map((segment: any) => segment?.text || '').join('');
        } else if (typeof deviceIdValue === 'object' && deviceIdValue !== null) {
          deviceIdStr = (deviceIdValue as { text?: string }).text || '';
        }
        deviceIdStr = deviceIdStr.trim();

        if (deviceIdStr) {
          const normalizedIds = deviceIdStr.split(',').map((id: string) => id.trim().toLowerCase());
          const uniqueIds = [...new Set(normalizedIds)];
          recordDeviceSets.push(new Set<string>(uniqueIds));
          console.log('从记录中提取到设备编号:', uniqueIds.join(', '));
        } else {
          console.log('设备编号字段为空或格式不支持');
          recordDeviceSets.push(new Set<string>());
        }
      }

      // 计算所有记录设备编号集合的交集
      let uniqueDevices: string[] = [];
      if (recordDeviceSets.length > 0) {
        uniqueDevices = Array.from(recordDeviceSets.reduce<Set<string>>((acc, set) => {
          return new Set([...acc].filter(x => set.has(x)));
        }, recordDeviceSets[0]));
      }
      console.log('所有记录的设备编号交集:', uniqueDevices);

      // 根据设备类型分类统计
      const displayDevices: string[] = [];
      const flipComputerDevices: string[] = [];
      const highPerfComputerDevices: string[] = [];

      for (const device of uniqueDevices) {
        const type = deviceIdToTypeMap.get(device);
        if (type === '显示器') {
          displayDevices.push(device);
        } else if (type === '翻页电脑') {
          flipComputerDevices.push(device);
        } else if (type === '高性能电脑') {
          highPerfComputerDevices.push(device);
        }
      }

      console.log('设备类型分类统计结果: 显示器(', displayDevices.length, '):', displayDevices.join(', '),
        '; 翻页电脑(', flipComputerDevices.length, '):', flipComputerDevices.join(', '),
        '; 高性能电脑(', highPerfComputerDevices.length, '):', highPerfComputerDevices.join(', '));

      // 获取数据分析表的各结果字段实例
      const displayListField = await dataAnalysisTable.getField<ITextField>(displayListFieldId);
      const displayCountField = await dataAnalysisTable.getField<INumberField>(displayCountFieldId);
      const flipComputerListField = await dataAnalysisTable.getField<ITextField>(flipComputerListFieldId);
      const flipComputerCountField = await dataAnalysisTable.getField<INumberField>(flipComputerCountFieldId);
      const highPerfComputerListField = await dataAnalysisTable.getField<ITextField>(highPerfComputerListFieldId);
      const highPerfComputerCountField = await dataAnalysisTable.getField<INumberField>(highPerfComputerCountFieldId);

      // 写入分类统计结果到数据分析表
      await Promise.all([
        displayListField.setValue(recordId, displayDevices.join(', ')),
        displayCountField.setValue(recordId, displayDevices.length),
        flipComputerListField.setValue(recordId, flipComputerDevices.join(', ')),
        flipComputerCountField.setValue(recordId, flipComputerDevices.length),
        highPerfComputerListField.setValue(recordId, highPerfComputerDevices.join(', ')),
        highPerfComputerCountField.setValue(recordId, highPerfComputerDevices.length)
      ]);

      console.log('设备类型分类统计结果写入成功');
    }

    console.log('设备分析逻辑执行完成');
  }, [deviceInfoTableId, deviceScheduleTableId, dataAnalysisTableId, deviceIdFieldId, deviceTypeFieldId,
    deviceUseTimeFieldId, deviceScheduleDeviceIdFieldId, analysisStartTimeFieldId, analysisEndTimeFieldId,
    displayListFieldId, displayCountFieldId, flipComputerListFieldId,
    flipComputerCountFieldId, highPerfComputerListFieldId, highPerfComputerCountFieldId]);


  return (
    <Form<{}> labelPosition='top' style={{ maxWidth: 800, margin: '0 auto' }}>
      <h4>1. 选择设备信息表</h4>
      <Form.Slot>
        <Select
          value={deviceInfoTableId}
          onChange={(value) => setDeviceInfoTableId(value as string)}
          placeholder="请选择设备信息表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>
      {deviceInfoTableId && (
        <>          
          <Form.Slot>
            <Select
              value={deviceIdFieldId}
              onChange={(value) => setDeviceIdFieldId(value as string)}
              placeholder="请选择设备编号字段"
            >
              {deviceInfoTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={deviceTypeFieldId}
              onChange={(value) => setDeviceTypeFieldId(value as string)}
              placeholder="请选择设备类型字段"
            >
              {deviceInfoTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
        </>
      )}

      <hr className="form-divider"/>
      <h4>2. 选择设备排班表</h4>
      <Form.Slot>
        <Select
          value={deviceScheduleTableId}
          onChange={(value) => setDeviceScheduleTableId(value as string)}
          placeholder="请选择设备排班表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>
      {deviceScheduleTableId && (
        <>          
          <Form.Slot>
            <Select
              value={deviceUseTimeFieldId}
              onChange={(value) => setDeviceUseTimeFieldId(value as string)}
              placeholder="请选择设备使用时间字段"
            >
              {deviceScheduleTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={deviceScheduleDeviceIdFieldId}
              onChange={(value) => setDeviceScheduleDeviceIdFieldId(value as string)}
              placeholder="请选择可用设备列表字段"
            >
              {deviceScheduleTableFields.map(({ name, id }) => (
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
          value={dataAnalysisTableId}
          onChange={(value) => setDataAnalysisTableId(value as string)}
          placeholder="请选择资源总量分析表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>
      {dataAnalysisTableId && (
        <>          
          <Form.Slot>
            <Select
              value={analysisStartTimeFieldId}
              onChange={(value) => setAnalysisStartTimeFieldId(value as string)}
              placeholder="请选择分析开始时间字段"
            >
              {dataAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={analysisEndTimeFieldId}
              onChange={(value) => setAnalysisEndTimeFieldId(value as string)}
              placeholder="请选择分析结束时间字段"
            >
              {dataAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select
              value={displayListFieldId}
              onChange={(value) => setDisplayListFieldId(value as string)}
              placeholder="请选择显示器清单字段"
            >
              {dataAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={displayCountFieldId}
              onChange={(value) => setDisplayCountFieldId(value as string)}
              placeholder="请选择显示器数量字段"
            >
              {dataAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={flipComputerListFieldId}
              onChange={(value) => setFlipComputerListFieldId(value as string)}
              placeholder="请选择翻页电脑清单字段"
            >
              {dataAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={flipComputerCountFieldId}
              onChange={(value) => setFlipComputerCountFieldId(value as string)}
              placeholder="请选择翻页电脑数量字段"
            >
              {dataAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={highPerfComputerListFieldId}
              onChange={(value) => setHighPerfComputerListFieldId(value as string)}
              placeholder="请选择高性能电脑清单字段"
            >
              {dataAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={highPerfComputerCountFieldId}
              onChange={(value) => setHighPerfComputerCountFieldId(value as string)}
              placeholder="请选择高性能电脑数量字段"
            >
              {dataAnalysisTableFields.map(({ name, id }) => (
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