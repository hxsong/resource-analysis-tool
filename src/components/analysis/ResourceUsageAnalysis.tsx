import { useState, useCallback, useEffect } from 'react';
import { bitable, ITableMeta, IFieldMeta, IDateTimeField, ITextField, INumberField } from "@lark-base-open/js-sdk";
import { Form, Button, Select } from '@douyinfe/semi-ui';
import useTableData from '../../hooks/useTableData';

/**
 * 资源使用分析组件
 * 功能：分析会议排期与资源使用情况，统计交叉时间段内的资源占用数据
 */
interface ResourceUsageAnalysisProps {
  tableList: ITableMeta[];
}

export default function ResourceUsageAnalysis({ tableList }: ResourceUsageAnalysisProps) {
  // 1. 会议排期表相关状态
  const [meetingScheduleTableId, setMeetingScheduleTableId] = useState<string>();
  const [meetingNameFieldId, setMeetingNameFieldId] = useState<string>();
  const [meetingModeFieldId, setMeetingModeFieldId] = useState<string>();
  const [meetingStartFieldId, setMeetingStartFieldId] = useState<string>();
  const [meetingEndFieldId, setMeetingEndFieldId] = useState<string>();
  const [juniorWorkersFieldId, setJuniorWorkersFieldId] = useState<string>();
  const [juniorCountFieldId, setJuniorCountFieldId] = useState<string>();
  const [midWorkersFieldId, setMidWorkersFieldId] = useState<string>();
  const [midCountFieldId, setMidCountFieldId] = useState<string>();
  const [seniorWorkersFieldId, setSeniorWorkersFieldId] = useState<string>();
  const [seniorCountFieldId, setSeniorCountFieldId] = useState<string>();
  const [monitorCountFieldId, setMonitorCountFieldId] = useState<string>();
  const [monitorListFieldId, setMonitorListFieldId] = useState<string>();
  const [pageTurnerCountFieldId, setPageTurnerCountFieldId] = useState<string>();
  const [pageTurnerListFieldId, setPageTurnerListFieldId] = useState<string>();
  const [highPerfPCCountFieldId, setHighPerfPCCountFieldId] = useState<string>();
  const [highPerfPCListFieldId, setHighPerfPCListFieldId] = useState<string>();
  const [accountCountFieldId, setAccountCountFieldId] = useState<string>();
  const [accountListFieldId, setAccountListFieldId] = useState<string>();

  // 2. 资源使用分析表相关状态
  const [resourceAnalysisTableId, setResourceAnalysisTableId] = useState<string>();
  const [resourceStartFieldId, setResourceStartFieldId] = useState<string>();
  const [resourceEndFieldId, setResourceEndFieldId] = useState<string>();
  const [meetingListFieldId, setMeetingListFieldId] = useState<string>();
  const [occupiedJuniorWorkersFieldId, setOccupiedJuniorWorkersFieldId] = useState<string>();
  const [occupiedJuniorCountFieldId, setOccupiedJuniorCountFieldId] = useState<string>();
  const [occupiedMidWorkersFieldId, setOccupiedMidWorkersFieldId] = useState<string>();
  const [occupiedMidCountFieldId, setOccupiedMidCountFieldId] = useState<string>();
  const [occupiedSeniorWorkersFieldId, setOccupiedSeniorWorkersFieldId] = useState<string>();
  const [occupiedSeniorCountFieldId, setOccupiedSeniorCountFieldId] = useState<string>();
  const [occupiedMonitorListFieldId, setOccupiedMonitorListFieldId] = useState<string>();
  const [occupiedMonitorCountFieldId, setOccupiedMonitorCountFieldId] = useState<string>();
  const [occupiedPageTurnerListFieldId, setOccupiedPageTurnerListFieldId] = useState<string>();
  const [occupiedPageTurnerCountFieldId, setOccupiedPageTurnerCountFieldId] = useState<string>();
  const [occupiedHighPerfPCListFieldId, setOccupiedHighPerfPCListFieldId] = useState<string>();
  const [occupiedHighPerfPCCountFieldId, setOccupiedHighPerfPCCountFieldId] = useState<string>();
  const [occupiedAccountListFieldId, setOccupiedAccountListFieldId] = useState<string>();
  const [occupiedAccountCountFieldId, setOccupiedAccountCountFieldId] = useState<string>();

  // 获取表格字段数据
    const { fields: meetingScheduleFields } = useTableData(meetingScheduleTableId);
    const { fields: resourceAnalysisFields } = useTableData(resourceAnalysisTableId);

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

    // 会议排期表字段映射
    const meetingScheduleMappings = [
      { label: '会议名称字段', setter: setMeetingNameFieldId },
      { label: '会议模型字段', setter: setMeetingModeFieldId },
      { label: '会议开始时间字段', setter: setMeetingStartFieldId },
      { label: '会议结束时间字段', setter: setMeetingEndFieldId },
      { label: '初级人员名单字段', setter: setJuniorWorkersFieldId },
      { label: '初级人员数量字段', setter: setJuniorCountFieldId },
      { label: '中级人员名单字段', setter: setMidWorkersFieldId },
      { label: '中级人员数量字段', setter: setMidCountFieldId },
      { label: '高级人员名单字段', setter: setSeniorWorkersFieldId },
      { label: '高级人员数量字段', setter: setSeniorCountFieldId },
      { label: '显示器数量字段', setter: setMonitorCountFieldId },
      { label: '显示器清单字段', setter: setMonitorListFieldId },
      { label: '翻页电脑数量字段', setter: setPageTurnerCountFieldId },
      { label: '翻页电脑清单字段', setter: setPageTurnerListFieldId },
      { label: '高性能电脑数量字段', setter: setHighPerfPCCountFieldId },
      { label: '高性能电脑清单字段', setter: setHighPerfPCListFieldId },
      { label: '会议账号数量字段', setter: setAccountCountFieldId },
      { label: '会议账号清单字段', setter: setAccountListFieldId },
    ];

    // 资源分析表字段映射
    const resourceAnalysisMappings = [
      { label: '资源分析开始时间字段', setter: setResourceStartFieldId },
      { label: '资源分析结束时间字段', setter: setResourceEndFieldId },
      { label: '当前时间段的会议列表字段', setter: setMeetingListFieldId },
      { label: '占用初级人员名单字段', setter: setOccupiedJuniorWorkersFieldId },
      { label: '占用初级人员数量字段', setter: setOccupiedJuniorCountFieldId },
      { label: '占用中级人员名单字段', setter: setOccupiedMidWorkersFieldId },
      { label: '占用中级人员数量字段', setter: setOccupiedMidCountFieldId },
      { label: '占用高级人员名单字段', setter: setOccupiedSeniorWorkersFieldId },
      { label: '占用高级人员数量字段', setter: setOccupiedSeniorCountFieldId },
      { label: '占用显示器清单字段', setter: setOccupiedMonitorListFieldId },
      { label: '占用显示器数量字段', setter: setOccupiedMonitorCountFieldId },
      { label: '占用翻页电脑清单字段', setter: setOccupiedPageTurnerListFieldId },
      { label: '占用翻页电脑数量字段', setter: setOccupiedPageTurnerCountFieldId },
      { label: '占用高性能电脑清单字段', setter: setOccupiedHighPerfPCListFieldId },
      { label: '占用高性能电脑数量字段', setter: setOccupiedHighPerfPCCountFieldId },
      { label: '占用会议账号清单字段', setter: setOccupiedAccountListFieldId },
      { label: '占用会议账号数量字段', setter: setOccupiedAccountCountFieldId },
    ];

    // 监听会议排期表字段变化，自动匹配字段
    useEffect(() => {
      if (meetingScheduleFields.length > 0) {
        autoSelectFields(meetingScheduleFields, meetingScheduleMappings);
      }
    }, [meetingScheduleFields]);

    // 监听资源分析表字段变化，自动匹配字段
    useEffect(() => {
      if (resourceAnalysisFields.length > 0) {
        autoSelectFields(resourceAnalysisFields, resourceAnalysisMappings);
      }
    }, [resourceAnalysisFields]);

  /**
   * 判断两个时间区间是否存在交叉
   * @param start1 区间1开始时间
   * @param end1 区间1结束时间
   * @param start2 区间2开始时间
   * @param end2 区间2结束时间
   * @returns 是否交叉
   */
  const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
    const s1 = new Date(start1).getTime();
    const e1 = new Date(end1).getTime();
    const s2 = new Date(start2).getTime();
    const e2 = new Date(end2).getTime();
    return s1 < e2 && e1 > s2;
  };

  /**
   * 执行资源使用分析
   * 1. 验证参数完整性
   * 2. 获取表格数据
   * 3. 筛选时间交叉的会议记录
   * 4. 聚合计算资源占用数据
   * 5. 写入分析结果到资源使用分析表
   */
  const handleAnalysis = useCallback(async () => {
    // 参数完整性校验
    const requiredParams = [
      meetingScheduleTableId, meetingNameFieldId, meetingModeFieldId, meetingStartFieldId, meetingEndFieldId,
      juniorWorkersFieldId, juniorCountFieldId, midWorkersFieldId, midCountFieldId, seniorWorkersFieldId,
      seniorCountFieldId, monitorCountFieldId, monitorListFieldId, pageTurnerCountFieldId, pageTurnerListFieldId,
      highPerfPCCountFieldId, highPerfPCListFieldId, accountCountFieldId, accountListFieldId,
      resourceAnalysisTableId, resourceStartFieldId, resourceEndFieldId, meetingListFieldId,
      occupiedJuniorWorkersFieldId, occupiedJuniorCountFieldId, occupiedMidWorkersFieldId, occupiedMidCountFieldId,
      occupiedSeniorWorkersFieldId, occupiedSeniorCountFieldId, occupiedMonitorListFieldId, occupiedMonitorCountFieldId,
      occupiedPageTurnerListFieldId, occupiedPageTurnerCountFieldId, occupiedHighPerfPCListFieldId,
      occupiedHighPerfPCCountFieldId, occupiedAccountListFieldId, occupiedAccountCountFieldId
    ];

    const missingParams = requiredParams.filter(param => !param);
    if (missingParams.length > 0) {
      console.error('参数验证失败: 缺少以下必要参数', missingParams);
      return;
    }

    try {
      // 获取表格实例
      const meetingTable = await bitable.base.getTableById(meetingScheduleTableId!);
      const resourceTable = await bitable.base.getTableById(resourceAnalysisTableId!);
      console.log('成功获取表格实例: 会议排期表ID=' + meetingScheduleTableId + ', 资源分析表ID=' + resourceAnalysisTableId);

      // 获取资源分析时间范围（假设分析表只有一条记录）
      const resourceRecordIds = await resourceTable.getRecordIdList();
      console.log('获取资源分析表记录: 共找到' + resourceRecordIds.length + '条记录');
      if (resourceRecordIds.length === 0) {
        console.error('资源使用分析表中没有记录');
        return;
      }
      // 遍历处理所有资源分析记录
      for (const resourceRecordId of resourceRecordIds) {
        console.log('处理资源分析记录ID:', resourceRecordId);
        const [resourceStart, resourceEnd] = await Promise.all([
          resourceTable.getField(resourceStartFieldId!).then(field => field.getValue(resourceRecordId)),
          resourceTable.getField(resourceEndFieldId!).then(field => field.getValue(resourceRecordId))
        ]);

        console.log('资源分析时间范围: 开始=' + resourceStart + ', 结束=' + resourceEnd);
        if (!resourceStart || !resourceEnd) {
          console.error('资源分析记录ID=' + resourceRecordId + ' 未设置时间范围，跳过处理');
          continue; // 跳过没有时间范围的记录
        }

        // 获取所有会议记录并筛选时间交叉的记录
        const meetingRecordIds = await meetingTable.getRecordIdList();
        console.log('获取会议记录总数: ' + meetingRecordIds.length);
        const overlappingMeetingIds: string[] = [];
        const meetingNames: string[] = [];

        for (const recordId of meetingRecordIds) {
          const [meetingStart, meetingEnd, meetingName] = await Promise.all([
            meetingTable.getField(meetingStartFieldId!).then(field => field.getValue(recordId)),
            meetingTable.getField(meetingEndFieldId!).then(field => field.getValue(recordId)),
            meetingTable.getField(meetingNameFieldId!).then(field => field.getValue(recordId))
          ]);
          console.log('检查会议时间重叠:', { recordId, meetingName, meetingStart, meetingEnd, resourceStart, resourceEnd });

          if (meetingStart && meetingEnd && isTimeOverlap(meetingStart, meetingEnd, resourceStart, resourceEnd)) {
            overlappingMeetingIds.push(recordId);
            meetingNames.push(meetingName[0]?.text || 'Unknown Meeting');
            console.log('添加重叠会议:', { recordId, meetingName });
          }
        }

        console.log('时间交叉分析完成: 找到' + overlappingMeetingIds.length + '条匹配会议记录');
        if (overlappingMeetingIds.length === 0) {
          console.log('没有找到时间交叉的会议记录，清空当前资源分析记录数据');
          // 写入空数据
          await writeAnalysisResult(resourceTable, resourceRecordId, [], { juniorWorkers: [], midWorkers: [], seniorWorkers: [], monitors: [], pageTurners: [], highPerfPCs: [], accounts: [] });
          continue;
        }

        // 聚合计算资源占用数据
        const aggregatedData = await aggregateResourceData(meetingTable, overlappingMeetingIds);
        console.log('资源数据聚合完成: ', { junior: aggregatedData.juniorWorkers.length, mid: aggregatedData.midWorkers.length, senior: aggregatedData.seniorWorkers.length, monitors: aggregatedData.monitors.length });

        // 写入分析结果
        await writeAnalysisResult(resourceTable, resourceRecordId, meetingNames, aggregatedData);
        console.log('资源使用分析结果写入成功: 会议列表=' + meetingNames.join('; '));
      }
      console.log('所有资源使用分析记录处理完成');

      return;

    } catch (error) {
      console.error('资源使用分析失败:', error);
    }
  }, [
    meetingScheduleTableId, meetingNameFieldId, meetingModeFieldId, meetingStartFieldId, meetingEndFieldId,
    juniorWorkersFieldId, juniorCountFieldId, midWorkersFieldId, midCountFieldId, seniorWorkersFieldId,
    seniorCountFieldId, monitorCountFieldId, monitorListFieldId, pageTurnerCountFieldId, pageTurnerListFieldId,
    highPerfPCCountFieldId, highPerfPCListFieldId, accountCountFieldId, accountListFieldId,
    resourceAnalysisTableId, resourceStartFieldId, resourceEndFieldId, meetingListFieldId,
    occupiedJuniorWorkersFieldId, occupiedJuniorCountFieldId, occupiedMidWorkersFieldId, occupiedMidCountFieldId,
    occupiedSeniorWorkersFieldId, occupiedSeniorCountFieldId, occupiedMonitorListFieldId,
    occupiedPageTurnerListFieldId, occupiedPageTurnerCountFieldId, occupiedHighPerfPCListFieldId,
    occupiedHighPerfPCCountFieldId, occupiedAccountListFieldId, occupiedAccountCountFieldId
  ]);

  /**
   * 聚合会议记录中的资源数据
   */
  const aggregateResourceData = async (table: any, recordIds: string[]) => {
    const juniorWorkers: string[] = [];
    const midWorkers: string[] = [];
    const seniorWorkers: string[] = [];
    const monitors: string[] = [];
    const pageTurners: string[] = [];
    const highPerfPCs: string[] = [];
    const accounts: string[] = [];

    for (const recordId of recordIds) {
  console.log('处理会议记录ID:', recordId);
  // 并行获取当前记录的所有资源字段值
  const [junior, mid, senior, monitorList, pageTurnerList, highPerfPCList, accountList] = await Promise.all([
        table.getField(juniorWorkersFieldId!).then((field: any) => field.getValue(recordId)),
        table.getField(midWorkersFieldId!).then((field: any) => field.getValue(recordId)),
        table.getField(seniorWorkersFieldId!).then((field: any) => field.getValue(recordId)),
        table.getField(monitorListFieldId!).then((field: any) => field.getValue(recordId)),
        table.getField(pageTurnerListFieldId!).then((field: any) => field.getValue(recordId)),
        table.getField(highPerfPCListFieldId!).then((field: any) => field.getValue(recordId)),
        table.getField(accountListFieldId!).then((field: any) => field.getValue(recordId))
      ]);
  console.log('提取的资源数据:', { junior, mid, senior, monitorList, pageTurnerList, highPerfPCList, accountList });

  // 处理人员数据
      if (junior?.text) juniorWorkers.push(...junior.text.split(',').map((name: string) => name.trim()));
      if (mid?.text) midWorkers.push(...mid.text.split(',').map((name: string) => name.trim()));
if (senior?.text) seniorWorkers.push(...senior.text.split(',').map((name: string) => name.trim()));

      // 处理设备数据
      if (monitorList?.text) monitors.push(...monitorList.text.split(',').map((item: string) => item.trim()));
      if (pageTurnerList?.text) pageTurners.push(...pageTurnerList.text.split(',').map((item: string) => item.trim()));
      if (highPerfPCList?.text) highPerfPCs.push(...highPerfPCList.text.split(',').map((item: string) => item.trim()));
      if (accountList?.text) accounts.push(...accountList.text.split(',').map((item: string) => item.trim()).filter(Boolean));
    }

    // 去重并统计
    const result = {
      juniorWorkers: [...new Set(juniorWorkers)],
      midWorkers: [...new Set(midWorkers)],
      seniorWorkers: [...new Set(seniorWorkers)],
      monitors: [...new Set(monitors)],
      pageTurners: [...new Set(pageTurners)],
      highPerfPCs: [...new Set(highPerfPCs)],
      accounts: [...new Set(accounts)]
    };
    console.log('资源数据聚合结果:', result);
    return result;
  };

  /**
   * 将分析结果写入资源使用分析表
   */
  const writeAnalysisResult = async (table: any, recordId: string, meetingNames: string[], data: any) => {
    await Promise.all([
      // 会议列表
      (async () => {
        const field = await table.getField(meetingListFieldId!);
        const value = meetingNames.join('; ');
        console.log('写入会议列表:', value);
        return field.setValue(recordId, value);
      })(),
      // 初级人员
      (async () => {
        const field = await table.getField(occupiedJuniorWorkersFieldId!);
        const value = data.juniorWorkers.join(', ');
        console.log('写入初级人员列表:', value);
        return field.setValue(recordId, value);
      })(),
      (async () => {
        const field = await table.getField(occupiedJuniorCountFieldId!);
        const value = data.juniorWorkers.length;
        console.log('写入初级人员数量:', value);
        return field.setValue(recordId, value);
      })(),
      // 中级人员
      (async () => {
        const field = await table.getField(occupiedMidWorkersFieldId!);
        const value = data.midWorkers.join(', ');
        console.log('写入中级人员列表:', value);
        return field.setValue(recordId, value);
      })(),
      (async () => {
        const field = await table.getField(occupiedMidCountFieldId!);
        const value = data.midWorkers.length;
        console.log('写入中级人员数量:', value);
        return field.setValue(recordId, value);
      })(),
      // 高级人员
      (async () => {
        const field = await table.getField(occupiedSeniorWorkersFieldId!);
        const value = data.seniorWorkers.join(', ');
        console.log('写入高级人员列表:', value);
        return field.setValue(recordId, value);
      })(),
      (async () => {
        const field = await table.getField(occupiedSeniorCountFieldId!);
        const value = data.seniorWorkers.length;
        console.log('写入高级人员数量:', value);
        return field.setValue(recordId, value);
      })(),
      // 显示器
      (async () => {
        const field = await table.getField(occupiedMonitorListFieldId!);
        const value = data.monitors.join(', ');
        console.log('写入显示器列表:', value);
        return field.setValue(recordId, value);
      })(),
      (async () => {
        const field = await table.getField(occupiedMonitorCountFieldId!);
        const value = data.monitors.length;
        console.log('写入显示器数量:', value);
        return field.setValue(recordId, value);
      })(),
      // 翻页电脑
      (async () => {
        const field = await table.getField(occupiedPageTurnerListFieldId!);
        const value = data.pageTurners.join(', ');
        console.log('写入翻页电脑列表:', value);
        return field.setValue(recordId, value);
      })(),
      (async () => {
        const field = await table.getField(occupiedPageTurnerCountFieldId!);
        const value = data.pageTurners.length;
        console.log('写入翻页电脑数量:', value);
        return field.setValue(recordId, value);
      })(),
      // 高性能电脑
      (async () => {
        const field = await table.getField(occupiedHighPerfPCListFieldId!);
        const value = data.highPerfPCs.join(', ');
        console.log('写入高性能电脑列表:', value);
        return field.setValue(recordId, value);
      })(),
      (async () => {
        const field = await table.getField(occupiedHighPerfPCCountFieldId!);
        const value = data.highPerfPCs.length;
        console.log('写入高性能电脑数量:', value);
        return field.setValue(recordId, value);
      })(),
      // 会议账号
      (async () => {
        const field = await table.getField(occupiedAccountListFieldId!);
        const value = data.accounts.join(', ');
        console.log('写入会议账号列表:', value);
        return field.setValue(recordId, value);
      })(),
      (async () => {
        const field = await table.getField(occupiedAccountCountFieldId!);
        const value = data.accounts.length;
        console.log('写入会议账号数量:', value);
        return field.setValue(recordId, value);
      })()
    ]);
  };

  return (
    <Form<{}> labelPosition='top' style={{ maxWidth: 800, margin: '0 auto' }}>
      <h4>1. 选择会议排期表</h4>
      {/* 会议排期表配置区域 */}
      <Form.Slot>
        <Select
          value={meetingScheduleTableId}
          onChange={(value) => setMeetingScheduleTableId(value as string)}
          placeholder="请选择会议排期表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>

      {meetingScheduleTableId && (
        <div style={{ marginLeft: 20 }}>
          <Form.Slot>
            <Select value={meetingNameFieldId} onChange={(v) => setMeetingNameFieldId(v as string)} placeholder="请选择会议名称字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={meetingModeFieldId} onChange={(v) => setMeetingModeFieldId(v as string)} placeholder="请选择会议模型字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={meetingStartFieldId} onChange={(v) => setMeetingStartFieldId(v as string)} placeholder="请选择会议开始时间字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={meetingEndFieldId} onChange={(v) => setMeetingEndFieldId(v as string)} placeholder="请选择会议结束时间字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={juniorWorkersFieldId} onChange={(v) => setJuniorWorkersFieldId(v as string)} placeholder="请选择初级人员名单字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={juniorCountFieldId} onChange={(v) => setJuniorCountFieldId(v as string)} placeholder="请选择初级人员数量字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={midWorkersFieldId} onChange={(v) => setMidWorkersFieldId(v as string)} placeholder="请选择中级人员名单字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={midCountFieldId} onChange={(v) => setMidCountFieldId(v as string)} placeholder="请选择中级人员数量字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={seniorWorkersFieldId} onChange={(v) => setSeniorWorkersFieldId(v as string)} placeholder="请选择高级人员名单字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={seniorCountFieldId} onChange={(v) => setSeniorCountFieldId(v as string)} placeholder="请选择高级人员数量字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={monitorCountFieldId} onChange={(v) => setMonitorCountFieldId(v as string)} placeholder="请选择显示器数量字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={monitorListFieldId} onChange={(v) => setMonitorListFieldId(v as string)} placeholder="请选择显示器清单字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={pageTurnerCountFieldId} onChange={(v) => setPageTurnerCountFieldId(v as string)} placeholder="请选择翻页电脑数量字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={pageTurnerListFieldId} onChange={(v) => setPageTurnerListFieldId(v as string)} placeholder="请选择翻页电脑清单字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={highPerfPCCountFieldId} onChange={(v) => setHighPerfPCCountFieldId(v as string)} placeholder="请选择高性能电脑数量字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={highPerfPCListFieldId} onChange={(v) => setHighPerfPCListFieldId(v as string)} placeholder="请选择高性能电脑清单字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={accountCountFieldId} onChange={(v) => setAccountCountFieldId(v as string)} placeholder="请选择会议账号数量字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={accountListFieldId} onChange={(v) => setAccountListFieldId(v as string)} placeholder="请选择会议账号清单字段">
              {meetingScheduleFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
        </div>
      )}

      <hr className="form-divider"/>

      {/* 资源使用分析表配置区域 */}
      <h4>3. 选择资源占用分析表</h4>
      <Form.Slot>
        <Select
          value={resourceAnalysisTableId}
          onChange={(value) => setResourceAnalysisTableId(value as string)}
          placeholder="请选择资源占用分析表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>

      {resourceAnalysisTableId && (
        <div style={{ marginLeft: 20 }}>
          <Form.Slot>
            <Select value={resourceStartFieldId} onChange={(v) => setResourceStartFieldId(v as string)} placeholder="请选择资源分析开始时间字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={resourceEndFieldId} onChange={(v) => setResourceEndFieldId(v as string)} placeholder="请选择资源分析结束时间字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={meetingListFieldId} onChange={(v) => setMeetingListFieldId(v as string)} placeholder="请选择当前时间段的会议列表字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedJuniorWorkersFieldId} onChange={(v) => setOccupiedJuniorWorkersFieldId(v as string)} placeholder="请选择占用初级人员名单字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedJuniorCountFieldId} onChange={(v) => setOccupiedJuniorCountFieldId(v as string)} placeholder="请选择占用初级人员数量字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedMidWorkersFieldId} onChange={(v) => setOccupiedMidWorkersFieldId(v as string)} placeholder="请选择占用中级人员名单字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedMidCountFieldId} onChange={(v) => setOccupiedMidCountFieldId(v as string)} placeholder="请选择占用中级人员数量字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedSeniorWorkersFieldId} onChange={(v) => setOccupiedSeniorWorkersFieldId(v as string)} placeholder="请选择占用高级人员名单字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedSeniorCountFieldId} onChange={(v) => setOccupiedSeniorCountFieldId(v as string)} placeholder="请选择占用高级人员数量字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedMonitorListFieldId} onChange={(v) => setOccupiedMonitorListFieldId(v as string)} placeholder="请选择占用显示器清单字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedMonitorCountFieldId} onChange={(v) => setOccupiedMonitorCountFieldId(v as string)} placeholder="请选择占用显示器数量字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedPageTurnerListFieldId} onChange={(v) => setOccupiedPageTurnerListFieldId(v as string)} placeholder="请选择占用翻页电脑清单字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedPageTurnerCountFieldId} onChange={(v) => setOccupiedPageTurnerCountFieldId(v as string)} placeholder="请选择占用翻页电脑数量字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedHighPerfPCListFieldId} onChange={(v) => setOccupiedHighPerfPCListFieldId(v as string)} placeholder="请选择占用高性能电脑清单字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedHighPerfPCCountFieldId} onChange={(v) => setOccupiedHighPerfPCCountFieldId(v as string)} placeholder="请选择占用高性能电脑数量字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedAccountListFieldId} onChange={(v) => setOccupiedAccountListFieldId(v as string)} placeholder="请选择占用会议账号清单字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>

          <Form.Slot>
            <Select value={occupiedAccountCountFieldId} onChange={(v) => setOccupiedAccountCountFieldId(v as string)} placeholder="请选择占用会议账号数量字段">
              {resourceAnalysisFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
        </div>
      )}
      <hr className="form-divider"/><br/>
      <Button theme='solid' onClick={handleAnalysis}>开始执行分析</Button>
    </Form>
  );
}