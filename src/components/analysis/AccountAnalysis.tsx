import { useState, useCallback, useEffect } from 'react';
import { bitable, ITableMeta, IFieldMeta, IDateTimeField, ITextField, INumberField } from "@lark-base-open/js-sdk";
import { Form, Button, Select } from '@douyinfe/semi-ui';
import useTableData from '../../hooks/useTableData';

interface AccountAnalysisProps {
  tableList: ITableMeta[];
}

export default function AccountAnalysis({ tableList }: AccountAnalysisProps) {
  // 账号分析相关状态
  const [accountTableId, setAccountTableId] = useState<string | undefined>('');
  const [meetingAccountFieldId, setMeetingAccountFieldId] = useState<string | undefined>('');
  const [accountScheduleTableId, setAccountScheduleTableId] = useState<string | undefined>('');
  const [accountUseTimeFieldId, setAccountUseTimeFieldId] = useState<string | undefined>('');
  const [meetingListFieldId, setMeetingListFieldId] = useState<string | undefined>('');
  const [accountAnalysisTableId, setAccountAnalysisTableId] = useState<string | undefined>('');
  const [accountAnalysisStartTimeFieldId, setAccountAnalysisStartTimeFieldId] = useState<string | undefined>('');
  const [accountAnalysisEndTimeFieldId, setAccountAnalysisEndTimeFieldId] = useState<string | undefined>('');
  const [meetingAccountListFieldId, setMeetingAccountListFieldId] = useState<string>('');
  const [meetingAccountCountFieldId, setMeetingAccountCountFieldId] = useState<string>('');

  // 使用自定义hook处理表格数据
    const { fields: accountTableFields } = useTableData(accountTableId);
    const { fields: accountScheduleTableFields } = useTableData(accountScheduleTableId);
    const { fields: accountAnalysisTableFields } = useTableData(accountAnalysisTableId);

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

    // 账号表字段映射
    const accountTableMappings = [
      { label: '会议账号字段', setter: setMeetingAccountFieldId }
    ];

    // 账号排期表字段映射
    const accountScheduleMappings = [
      { label: '账号使用时间字段', setter: setAccountUseTimeFieldId },
      { label: '可用账号列表字段', setter: setMeetingListFieldId }
    ];

    // 账号分析表字段映射
    const accountAnalysisMappings = [
      { label: '资源分析开始时间字段', setter: setAccountAnalysisStartTimeFieldId },
      { label: '资源分析结束时间字段', setter: setAccountAnalysisEndTimeFieldId },
      { label: '会议账号清单字段', setter: setMeetingAccountListFieldId },
      { label: '会议账号数量字段', setter: setMeetingAccountCountFieldId }
    ];

    // 监听账号表字段变化，自动匹配字段
    useEffect(() => {
      if (accountTableFields.length > 0) {
        autoSelectFields(accountTableFields, accountTableMappings);
      }
    }, [accountTableFields]);

    // 监听账号排期表字段变化
    useEffect(() => {
      if (accountScheduleTableFields.length > 0) {
        autoSelectFields(accountScheduleTableFields, accountScheduleMappings);
      }
    }, [accountScheduleTableFields]);

    // 监听账号分析表字段变化
    useEffect(() => {
      if (accountAnalysisTableFields.length > 0) {
        autoSelectFields(accountAnalysisTableFields, accountAnalysisMappings);
      }
    }, [accountAnalysisTableFields]);

  // 账号分析主方法
  /**
   * 账号分析主函数 - 根据选择的时间范围和表格数据，分析符合条件的会议账号并写入结果
   * 1. 获取账号排期表数据
   * 2. 分析时间范围并筛选相关记录
   * 3. 排序排期记录并提取会议账号
   * 4. 计算交集并统计账号数量
   * 5. 将结果写入数据分析表
   */
  const handleAnalysis = useCallback<() => Promise<void>>(async () => {
    console.log('[账号分析] 开始执行账号分析流程');
    // 验证必要参数
    if (!accountScheduleTableId || !accountUseTimeFieldId || !meetingListFieldId || 
        !accountAnalysisTableId || !accountAnalysisStartTimeFieldId || 
        !accountAnalysisEndTimeFieldId || !meetingAccountListFieldId || !meetingAccountCountFieldId) {
      console.error('[账号分析] 参数验证失败: 缺少必要的配置参数');
      return;
    }
    console.log('[账号分析] 参数验证通过，开始数据处理');

    try {
      // 获取账号排期表数据
      console.log('[账号分析] 开始获取账号排期表数据，表ID:', accountScheduleTableId);
      const scheduleTable = await bitable.base.getTableById(accountScheduleTableId);
      const scheduleRecordIds = await scheduleTable.getRecordIdList();
      console.log('[账号分析] 成功获取账号排期表记录ID列表，共', scheduleRecordIds.length, '条记录');
      const useTimeField = await scheduleTable.getField<IDateTimeField>(accountUseTimeFieldId);
      const meetingListField = await scheduleTable.getField<ITextField>(meetingListFieldId);
      console.log('[账号分析] 成功获取账号排期表字段引用');

      // 获取分析时间范围
      console.log('[账号分析] 开始获取分析时间范围，分析表ID:', accountAnalysisTableId);
      const analysisTable = await bitable.base.getTableById(accountAnalysisTableId);
      const analysisRecordIds = await analysisTable.getRecordIdList();
      if (analysisRecordIds.length === 0) {
        console.error('[账号分析] 分析表中没有找到记录，无法执行分析');
        return;
      }
      console.log('[账号分析] 分析表记录数:', analysisRecordIds.length, '，开始逐条处理记录');
      const startTimeField = await analysisTable.getField<IDateTimeField>(accountAnalysisStartTimeFieldId);
      const endTimeField = await analysisTable.getField<IDateTimeField>(accountAnalysisEndTimeFieldId);
      const resultListField = await analysisTable.getField<ITextField>(meetingAccountListFieldId);
      const resultCountField = await analysisTable.getField<INumberField>(meetingAccountCountFieldId);

      // 遍历所有分析记录
      for (const recordId of analysisRecordIds) {
        console.log('[账号分析] 开始处理记录:', recordId);
        const startTime = await startTimeField.getValue(recordId);
        const endTime = await endTimeField.getValue(recordId);
        console.log('[账号分析] 从分析表获取时间范围: 开始时间=', startTime, '结束时间=', endTime);

        if (!startTime || !endTime) {
          console.error('[账号分析] 记录', recordId, '的时间范围未设置或格式不正确，跳过处理');
          continue;
        }

        const startTimestamp = new Date(startTime).getTime();
        const endTimestamp = new Date(endTime).getTime();
        console.log('[账号分析] 时间范围转换为时间戳: 开始=', startTimestamp, '结束=', endTimestamp);

        // 获取所有排期记录并按开始时间排序
        console.log('[账号分析] 获取所有排期记录的时间戳并排序');
        const scheduleRecordsWithTime: Array<{id: string, timestamp: number}> = [];
        for (const scheduleRecordId of scheduleRecordIds) {
          const useTime = await useTimeField.getValue(scheduleRecordId);
          const timestamp = new Date(useTime).getTime();
          scheduleRecordsWithTime.push({ id: scheduleRecordId, timestamp });
        }
        // 按时间戳升序排序
        scheduleRecordsWithTime.sort((a, b) => a.timestamp - b.timestamp);
        console.log('[账号分析] 排期记录按时间排序完成');

        // 找到最后一条账号使用时间早于分析开始时间的记录
        let lastBeforeIndex = -1;
        for (let i = 0; i < scheduleRecordsWithTime.length; i++) {
          if (scheduleRecordsWithTime[i].timestamp <= startTimestamp) {
            lastBeforeIndex = i;
          } else {
            break;
          }
        }
        console.log('[账号分析] 最后一条早于开始时间的记录索引:', lastBeforeIndex);

        // 找到第一条账号使用时间晚于分析结束时间的记录
        let firstAfterIndex = scheduleRecordsWithTime.length;
        for (let i = 0; i < scheduleRecordsWithTime.length; i++) {
          if (scheduleRecordsWithTime[i].timestamp >= endTimestamp) {
            firstAfterIndex = i;
            break;
          }
        }
        console.log('[账号分析] 第一条晚于结束时间的记录索引:', firstAfterIndex);

        // 获取中间记录范围
        const middleRecords = scheduleRecordsWithTime.slice(lastBeforeIndex, firstAfterIndex);
        console.log('[账号分析] 中间记录数量:', middleRecords.length, '，范围:', lastBeforeIndex + 1, '至', firstAfterIndex);

        let accountIntersection: Set<string> | null = null;
        if (middleRecords.length === 0) {
          console.log('[账号分析] 没有找到符合条件的中间记录');
          accountIntersection = new Set();
        } else {
          // 提取会议账号并计算交集
          console.log('[账号分析] 开始提取会议账号并计算交集');
          for (const record of middleRecords) {
            const meetingList = await meetingListField.getValue(record.id);
            let accounts: string[] = [];

            // 处理不同类型的字段值
            if (typeof meetingList === 'string') {
              accounts = (meetingList as string).split(/[,，;；]+/).map((acc: string) => acc.trim()).filter(Boolean);
            } else if (Array.isArray(meetingList)) {
              accounts = meetingList.flatMap(item => {
                let text;
                if (typeof item === 'object' && item && 'text' in item) {
                  text = (item as { text?: string }).text?.trim() || '';
                } else {
                  text = String(item).trim();
                }
                return text ? text.split(/[,，;；]+/).map(acc => acc.trim()).filter(Boolean) : [];
              });
            } else if (typeof meetingList === 'object' && meetingList && 'text' in meetingList) {
              const text = String((meetingList as { text: string }).text).trim();
              accounts = text.split(/[,，;；]+/).map(acc => acc.trim()).filter(Boolean);
            }

            console.log('[账号分析] 记录', record.id, '提取到账号:', accounts.join(','));

            // 计算交集
            const recordAccounts = new Set(accounts);
            console.log('[账号分析] 记录', record.id, '账号集合:', Array.from(recordAccounts));
            if (accountIntersection === null) {
              accountIntersection = recordAccounts;
              console.log('[账号分析] 初始化交集:', Array.from(accountIntersection));
            } else {
              const prevIntersection: Set<string> = new Set(accountIntersection);
              accountIntersection = new Set([...prevIntersection].filter(acc => recordAccounts.has(acc)));
              console.log('[账号分析] 交集变化: 前=', Array.from(prevIntersection), '后=', Array.from(accountIntersection));
            }
            console.log('[账号分析] 当前交集大小:', accountIntersection.size);

            // 如果交集为空，提前退出循环
            if (accountIntersection.size === 0) break;
          }
        }

        const finalAccounts = accountIntersection ? Array.from(accountIntersection) : [];

        // 更新分析结果
        await resultListField.setValue(recordId, finalAccounts.join(','));
        await resultCountField.setValue(recordId, accountIntersection?.size || 0);
        console.log('[账号分析] 成功更新分析结果到记录', recordId, '，会议账号数量:', finalAccounts.length);
      }

      console.log('[账号分析] 所有记录处理完成');


      console.log('[账号分析] 账号分析流程执行完成');
    } catch (error) {
      console.error('[账号分析] 分析过程发生错误:', error);
    }
  }, [accountScheduleTableId, accountUseTimeFieldId, meetingListFieldId, accountAnalysisTableId, accountAnalysisStartTimeFieldId, accountAnalysisEndTimeFieldId, meetingAccountListFieldId, meetingAccountCountFieldId]);


  return (
    <Form<{}> labelPosition='top' style={{ maxWidth: 800, margin: '0 auto' }}>
      <h4>1. 选择账号信息表</h4>
      <Form.Slot>
        <Select
          value={accountTableId}
          onChange={(value) => setAccountTableId(value as string)}
          placeholder="请选择账号信息表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>
      {accountTableId && (
        <Form.Slot>
          <Select
            value={meetingAccountFieldId}
            onChange={(value) => setMeetingAccountFieldId(value as string)}
            placeholder="请选择会议账号字段"
          >
            {accountTableFields.map(({ name, id }) => (
              <Select.Option key={id} value={id}>{name}</Select.Option>
            ))}
          </Select>
        </Form.Slot>
      )}

      <hr className="form-divider"/>
      <h4>2. 选择账号排班表</h4>
      <Form.Slot>
        <Select
          value={accountScheduleTableId}
          onChange={(value) => setAccountScheduleTableId(value as string)}
          placeholder="请选择账号排班表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>
      {accountScheduleTableId && (
        <>          
          <Form.Slot>
            <Select
              value={accountUseTimeFieldId}
              onChange={(value) => setAccountUseTimeFieldId(value as string)}
              placeholder="请选择账号使用时间字段"
            >
              {accountScheduleTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={meetingListFieldId}
              onChange={(value) => setMeetingListFieldId(value as string)}
              placeholder="请选择可用账号列表字段"
            >
              {accountScheduleTableFields.map(({ name, id }) => (
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
          value={accountAnalysisTableId}
          onChange={(value) => setAccountAnalysisTableId(value as string)}
          placeholder="请选择资源总量分析表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>
      {accountAnalysisTableId && (
        <>          
          <Form.Slot>
            <Select
              value={accountAnalysisStartTimeFieldId}
              onChange={(value) => setAccountAnalysisStartTimeFieldId(value as string)}
              placeholder="请选择账号分析开始时间字段"
            >
              {accountAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={accountAnalysisEndTimeFieldId}
              onChange={(value) => setAccountAnalysisEndTimeFieldId(value as string)}
              placeholder="请选择账号分析结束时间字段"
            >
              {accountAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={meetingAccountListFieldId}
              onChange={(value) => setMeetingAccountListFieldId(value as string)}
              placeholder="请选择会议账号清单字段"
            >
              {accountAnalysisTableFields.map(({ name, id }) => (
                <Select.Option key={id} value={id}>{name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select
              value={meetingAccountCountFieldId}
              onChange={(value) => setMeetingAccountCountFieldId(value as string)}
              placeholder="请选择会议账号数量字段"
            >
              {accountAnalysisTableFields.map(({ name, id }) => (
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