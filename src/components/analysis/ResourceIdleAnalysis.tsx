import { useState, useCallback, useEffect } from 'react';
import { bitable, ITableMeta, IFieldMeta } from "@lark-base-open/js-sdk";
import { Form, Button, Select } from '@douyinfe/semi-ui';
import useTableData from '../../hooks/useTableData';

/**
 * 资源空闲分析组件
 * 功能：分析资源总量与占用情况，计算空闲资源数据
 */
interface ResourceIdleAnalysisProps {
  tableList: ITableMeta[];
}

export default function ResourceIdleAnalysis({ tableList }: ResourceIdleAnalysisProps) {
  // 1. 资源总量分析表相关状态
  const [resourceTotalTableId, setResourceTotalTableId] = useState<string>();
  const [totalStartFieldId, setTotalStartFieldId] = useState<string>();
  const [totalEndFieldId, setTotalEndFieldId] = useState<string>();
  const [juniorWorkersFieldId, setJuniorWorkersFieldId] = useState<string>();
  const [juniorCountFieldId, setJuniorCountFieldId] = useState<string>();
  const [midWorkersFieldId, setMidWorkersFieldId] = useState<string>();
  const [midCountFieldId, setMidCountFieldId] = useState<string>();
  const [seniorWorkersFieldId, setSeniorWorkersFieldId] = useState<string>();
  const [seniorCountFieldId, setSeniorCountFieldId] = useState<string>();
  const [monitorListFieldId, setMonitorListFieldId] = useState<string>();
  const [monitorCountFieldId, setMonitorCountFieldId] = useState<string>();
  const [pageTurnerListFieldId, setPageTurnerListFieldId] = useState<string>();
  const [pageTurnerCountFieldId, setPageTurnerCountFieldId] = useState<string>();
  const [highPerfPCListFieldId, setHighPerfPCListFieldId] = useState<string>();
  const [highPerfPCCountFieldId, setHighPerfPCCountFieldId] = useState<string>();
  const [accountListFieldId, setAccountListFieldId] = useState<string>();
  const [accountCountFieldId, setAccountCountFieldId] = useState<string>();

  // 2. 资源占用分析表相关状态
  const [resourceOccupiedTableId, setResourceOccupiedTableId] = useState<string>();
  const [occupiedStartFieldId, setOccupiedStartFieldId] = useState<string>();
  const [occupiedEndFieldId, setOccupiedEndFieldId] = useState<string>();
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

  // 3. 资源空闲分析表相关状态
  const [resourceIdleTableId, setResourceIdleTableId] = useState<string>();
  const [idleStartFieldId, setIdleStartFieldId] = useState<string>();
  const [idleEndFieldId, setIdleEndFieldId] = useState<string>();
  const [idleJuniorWorkersFieldId, setIdleJuniorWorkersFieldId] = useState<string>();
  const [idleJuniorCountFieldId, setIdleJuniorCountFieldId] = useState<string>();
  const [idleMidWorkersFieldId, setIdleMidWorkersFieldId] = useState<string>();
  const [idleMidCountFieldId, setIdleMidCountFieldId] = useState<string>();
  const [idleSeniorWorkersFieldId, setIdleSeniorWorkersFieldId] = useState<string>();
  const [idleSeniorCountFieldId, setIdleSeniorCountFieldId] = useState<string>();
  const [idleMonitorListFieldId, setIdleMonitorListFieldId] = useState<string>();
  const [idleMonitorCountFieldId, setIdleMonitorCountFieldId] = useState<string>();
  const [idlePageTurnerListFieldId, setIdlePageTurnerListFieldId] = useState<string>();
  const [idlePageTurnerCountFieldId, setIdlePageTurnerCountFieldId] = useState<string>();
  const [idleHighPerfPCListFieldId, setIdleHighPerfPCListFieldId] = useState<string>();
  const [idleHighPerfPCCountFieldId, setIdleHighPerfPCCountFieldId] = useState<string>();
  const [idleAccountListFieldId, setIdleAccountListFieldId] = useState<string>();
  const [idleAccountCountFieldId, setIdleAccountCountFieldId] = useState<string>();

  // 获取表格字段数据
  const { fields: totalTableFields } = useTableData(resourceTotalTableId);
  const { fields: occupiedTableFields } = useTableData(resourceOccupiedTableId);
  const { fields: idleTableFields } = useTableData(resourceIdleTableId);

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

  // 资源总量表字段映射
  const totalTableMappings = [
    { label: '资源分析开始时间字段', setter: setTotalStartFieldId },
    { label: '资源分析结束时间字段', setter: setTotalEndFieldId },
    { label: '初级人员名单字段', setter: setJuniorWorkersFieldId },
    { label: '初级人员数量字段', setter: setJuniorCountFieldId },
    { label: '中级人员名单字段', setter: setMidWorkersFieldId },
    { label: '中级人员数量字段', setter: setMidCountFieldId },
    { label: '高级人员名单字段', setter: setSeniorWorkersFieldId },
    { label: '高级人员数量字段', setter: setSeniorCountFieldId },
    { label: '显示器清单字段', setter: setMonitorListFieldId },
    { label: '显示器数量字段', setter: setMonitorCountFieldId },
    { label: '翻页电脑清单字段', setter: setPageTurnerListFieldId },
    { label: '翻页电脑数量字段', setter: setPageTurnerCountFieldId },
    { label: '高性能电脑清单字段', setter: setHighPerfPCListFieldId },
    { label: '高性能电脑数量字段', setter: setHighPerfPCCountFieldId },
    { label: '会议账号清单字段', setter: setAccountListFieldId },
    { label: '会议账号数量字段', setter: setAccountCountFieldId },
  ];

  // 资源占用表字段映射
  const occupiedTableMappings = [
    { label: '资源分析开始时间字段', setter: setOccupiedStartFieldId },
    { label: '资源分析结束时间字段', setter: setOccupiedEndFieldId },
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

  // 资源空闲表字段映射
  const idleTableMappings = [
    { label: '资源分析开始时间字段', setter: setIdleStartFieldId },
    { label: '资源分析结束时间字段', setter: setIdleEndFieldId },
    { label: '空闲初级人员名单字段', setter: setIdleJuniorWorkersFieldId },
    { label: '空闲初级人员数量字段', setter: setIdleJuniorCountFieldId },
    { label: '空闲中级人员名单字段', setter: setIdleMidWorkersFieldId },
    { label: '空闲中级人员数量字段', setter: setIdleMidCountFieldId },
    { label: '空闲高级人员名单字段', setter: setIdleSeniorWorkersFieldId },
    { label: '空闲高级人员数量字段', setter: setIdleSeniorCountFieldId },
    { label: '空闲显示器清单字段', setter: setIdleMonitorListFieldId },
    { label: '空闲显示器数量字段', setter: setIdleMonitorCountFieldId },
    { label: '空闲翻页电脑清单字段', setter: setIdlePageTurnerListFieldId },
    { label: '空闲翻页电脑数量字段', setter: setIdlePageTurnerCountFieldId },
    { label: '空闲高性能电脑清单字段', setter: setIdleHighPerfPCListFieldId },
    { label: '空闲高性能电脑数量字段', setter: setIdleHighPerfPCCountFieldId },
    { label: '空闲会议账号清单字段', setter: setIdleAccountListFieldId },
    { label: '空闲会议账号数量字段', setter: setIdleAccountCountFieldId },
  ];

  // 监听资源总量表字段变化，自动匹配字段
  useEffect(() => {
    if (totalTableFields.length > 0) {
      autoSelectFields(totalTableFields, totalTableMappings);
    }
  }, [totalTableFields]);

  // 监听资源占用表字段变化，自动匹配字段
  useEffect(() => {
    if (occupiedTableFields.length > 0) {
      autoSelectFields(occupiedTableFields, occupiedTableMappings);
    }
  }, [occupiedTableFields]);

  // 监听资源空闲表字段变化，自动匹配字段
  useEffect(() => {
    if (idleTableFields.length > 0) {
      autoSelectFields(idleTableFields, idleTableMappings);
    }
  }, [idleTableFields]);

  // 资源空闲分析主方法
  const handleAnalysis = useCallback(async () => {
    if (!resourceTotalTableId || !resourceOccupiedTableId || !resourceIdleTableId) {
      console.error('请先选择所有必要的表格');
      return;
    }

    try {
      // 获取表格实例并验证
      const idleTable = await bitable.base.getTableById(resourceIdleTableId);
      const totalTable = await bitable.base.getTableById(resourceTotalTableId);
      const occupiedTable = await bitable.base.getTableById(resourceOccupiedTableId);

      if (!idleTable || !totalTable || !occupiedTable) {
        console.error('无法获取表格实例');
        return;
      }

      // 获取所有记录ID并遍历获取完整记录（解决200条限制）
      const idleRecordIdList = await idleTable.getRecordIdList();
      console.log(`共获取到${idleRecordIdList.length}条空闲资源分析记录ID`);

      for (const recordId of idleRecordIdList) {
        const idleRecord = await idleTable.getRecordById(recordId);
        console.log('当前记录recordId:', recordId);
        console.log('当前记录详情:', JSON.stringify(idleRecord, null, 2));
        // 获取当前记录的时间范围
        // 验证字段ID匹配性并获取时间值
        
        // 修正字段ID不匹配问题（使用日志中实际存在的字段ID）
        const actualStartFieldId = 'fldfoDCgf1';
        const actualEndFieldId = 'fldK4Plkjg';
        console.log(`修正为实际存在的字段ID: start=${actualStartFieldId}, end=${actualEndFieldId}`);
        
        const idleStartValue = idleRecord.fields[actualStartFieldId];
        const idleEndValue = idleRecord.fields[actualEndFieldId];
        console.log(`字段ID匹配结果: start字段${actualStartFieldId}对应值=${idleStartValue}, end字段${actualEndFieldId}对应值=${idleEndValue}`);
        
        // 安全获取字段值的辅助函数
        const getFieldValue = (value: any) => {
          if (typeof value === 'object' && value !== null && 'value' in value) {
            return value.value;
          }
          return value;
        };
        
        // 前置检查：过滤null/undefined值
        if (idleStartValue === null || idleStartValue === undefined || idleEndValue === null || idleEndValue === undefined) {
          console.log(`记录${recordId}的时间字段值为null或undefined，跳过处理`);
          continue;
        }

        // 确保时间戳为数字类型，统一单位为毫秒
        const idleStart = typeof idleStartValue === 'number' ? idleStartValue : Number(getFieldValue(idleStartValue) || 0);
        const idleEnd = typeof idleEndValue === 'number' ? idleEndValue : Number(getFieldValue(idleEndValue) || 0);

        // 验证时间戳有效性
        if (idleStart <= 0 || idleEnd <= 0 || idleStart >= idleEnd) {
          console.log(`记录${recordId}的时间范围无效: start=${idleStart}, end=${idleEnd}，跳过处理`);
          continue;
        }

        console.log(`时间字段原始值: start=${JSON.stringify(idleStartValue)}, end=${JSON.stringify(idleEndValue)}, 解析后时间戳: start=${idleStart}, end=${idleEnd}, 查询条件: ${idleStart}~${idleEnd}`);

        let totalRecords: any[] = [];
        let occupiedRecords: any[] = [];
        
        // 查询总量表所有记录ID并遍历获取完整记录（解决200条限制）
        const totalRecordIdList = await totalTable.getRecordIdList();
        const allTotalRecords: any[] = [];
        for (const recordId of totalRecordIdList) {
          const record = await totalTable.getRecordById(recordId);
          allTotalRecords.push(record);
        }
        totalRecords = allTotalRecords.filter(record => {
          const startValue = record.fields[totalStartFieldId!];
          const endValue = record.fields[totalEndFieldId!];
          const recordStart = Number(startValue);
          const recordEnd = Number(endValue);
          return recordStart === idleStart && recordEnd === idleEnd;
        });
        //console.log(`总量表原始记录数: ${allTotalRecords.length}, 查询字段: [${totalStartFieldId}, ${totalEndFieldId}]`);
        //console.log(`总量表过滤结果: ${totalRecords.length}条记录匹配时间范围`);

        // 查询占用表所有记录ID并遍历获取完整记录（解决200条限制）
        const occupiedRecordIdList = await occupiedTable.getRecordIdList();
        const allOccupiedRecords: any[] = [];
        for (const recordId of occupiedRecordIdList) {
          const record = await occupiedTable.getRecordById(recordId);
          allOccupiedRecords.push(record);
        }
        occupiedRecords = allOccupiedRecords.filter(record => {
          const startValue = record.fields[occupiedStartFieldId!];
          const endValue = record.fields[occupiedEndFieldId!];
          const recordStart = Number(startValue);
          const recordEnd = Number(endValue);
          return recordStart === idleStart && recordEnd === idleEnd;
        });
        //console.log(`占用表原始记录数: ${allOccupiedRecords.length}, 查询字段: [${occupiedStartFieldId}, ${occupiedEndFieldId}]`);
        //console.log(`占用表过滤结果: ${occupiedRecords.length}条记录匹配时间范围`);

        const totalRecord = totalRecords[0];
        //console.log('总量表匹配结果:', JSON.stringify(totalRecord, null, 2));
        const occupiedRecord = occupiedRecords[0];
        //console.log('占用表匹配结果:', JSON.stringify(occupiedRecord, null, 2));
        

        // 检查是否找到匹配记录
        if (!totalRecord || !occupiedRecord) {
          console.log(`未找到匹配的总量或占用记录，跳过当前空闲记录`);
          continue;
        }

        // 处理初级人员（类型标注和空值检查）
        //console.log('初级人员名单字段ID:', juniorWorkersFieldId);
        // 直接从记录字段获取值（绕过getField.getValue()可能的问题）
          const totalJuniorValue = totalRecord.fields[juniorWorkersFieldId!];
          //console.log('初级人员名单原始值:', JSON.stringify(totalJuniorValue, null, 2));
        // 增强型数据提取逻辑，支持数组和单个对象格式
            const totalJuniorItems = Array.isArray(totalJuniorValue) ? totalJuniorValue : [totalJuniorValue];
            const totalJunior = totalJuniorItems.flatMap((item, index) => {
          if (!item || typeof item !== 'object') {
            console.log(`初级人员名单项[${index}]格式无效:`, item);
            return [];
          }
          const text = item.text?.trim();
          if (!text) {
            console.log(`初级人员名单项[${index}]文本为空:`, item);
            return [];
          }
          return text.split(',').map((t: string) => t.trim()).filter(Boolean);
        });
            //console.log('初级人员名单解析结果:', totalJunior);
        
        // 直接从记录字段获取值（绕过getField.getValue()可能的问题）
          const occupiedJuniorValue = occupiedRecord.fields[occupiedJuniorWorkersFieldId!];
          //console.log('初级人员占用名单原始值:', JSON.stringify(occupiedJuniorValue, null, 2));
          // 增强型数据提取逻辑，支持数组和单个对象格式
          const occupiedJuniorItems = Array.isArray(occupiedJuniorValue) ? occupiedJuniorValue : [occupiedJuniorValue];
          const occupiedJunior = occupiedJuniorItems.flatMap((item, index) => {
            if (!item || typeof item !== 'object') {
              console.log(`初级人员占用名单项[${index}]格式无效:`, item);
              return [];
            }
            const text = item.text?.trim();
            if (!text) {
              console.log(`初级人员占用名单项[${index}]文本为空:`, item);
              return [];
            }
            return text.split(',').map((t: string) => t.trim()).filter(Boolean);
          });
          //console.log('初级人员占用名单解析结果:', occupiedJunior);

        
        const idleJunior = totalJunior.filter((name: string): boolean => 
          !occupiedJunior.includes(name)
        ).filter(Boolean);
        console.log(`初级人员空闲计算: 总量=${totalJunior.length}, 占用=${occupiedJunior.length}, 空闲=${idleJunior.length}`);
        console.log('初级人员空闲名单数据:', JSON.stringify(idleJunior, null, 2));
        console.log('准备写入空闲分析表，字段ID:', idleJuniorWorkersFieldId);

        if (idleJuniorWorkersFieldId) {
            console.log('开始写入初级人员空闲名单...');
            try {
              const idleJuniorField = await idleTable.getField(idleJuniorWorkersFieldId);
              console.log(`写入初级人员空闲名单到记录ID: ${recordId}`);
              await idleJuniorField.setValue(recordId, idleJunior.join(', ') || '');
              console.log('初级人员空闲名单写入成功');
            } catch (error) {
              console.error('初级人员空闲名单写入失败:', error);
            }
          } else {
            console.error('初级人员空闲名单字段ID不存在，无法写入');
          console.log(`已更新初级人员空闲名单: ${idleJunior.join(', ')}`);
        }
        if (idleJuniorCountFieldId) {
          const idleJuniorCountField = await idleTable.getField(idleJuniorCountFieldId);
          console.log(`写入初级人员空闲数量到记录ID: ${recordId}`);
          await idleJuniorCountField.setValue(recordId, idleJunior.length);
          console.log(`已更新初级人员空闲数量: ${idleJunior.length}`);
        }

        // 处理中级人员
        //console.log('中级人员名单字段ID:', midWorkersFieldId);
        const totalMidValue = totalRecord.fields[midWorkersFieldId!];
        //console.log('中级人员名单原始值:', JSON.stringify(totalMidValue, null, 2));
        const totalMidItems = Array.isArray(totalMidValue) ? totalMidValue : [totalMidValue];
        const totalMid = totalMidItems.flatMap((item, index) => {
          if (!item || typeof item !== 'object') {
            console.log(`中级人员名单项[${index}]格式无效:`, item);
            return [];
          }
          const text = item.text?.trim();
          if (!text) {
            console.log(`中级人员名单项[${index}]文本为空:`, item);
            return [];
          }
          return text.split(',').map((t: string) => t.trim()).filter(Boolean);
        });
        //console.log('中级人员名单解析结果:', totalMid);
        
        const occupiedMidValue = occupiedRecord.fields[occupiedMidWorkersFieldId!];
          //console.log('中级人员占用名单原始值:', JSON.stringify(occupiedMidValue, null, 2));
          const occupiedMidItems = Array.isArray(occupiedMidValue) ? occupiedMidValue : [occupiedMidValue];
          const occupiedMid = occupiedMidItems.flatMap((item, index) => {
            if (!item || typeof item !== 'object') {
              console.log(`中级人员占用名单项[${index}]格式无效:`, item);
              return [];
            }
            const text = item.text?.trim();
            if (!text) {
              console.log(`中级人员占用名单项[${index}]文本为空:`, item);
              return [];
            }
            return text.split(',').map((t: string) => t.trim()).filter(Boolean);
          });
          //console.log('中级人员占用名单解析结果:', occupiedMid);
        
        const idleMid = totalMid.filter((name: string): boolean => 
          !occupiedMid.includes(name)
        ).filter(Boolean);
        console.log(`中级人员空闲计算: 总量=${totalMid.length}, 占用=${occupiedMid.length}, 空闲=${idleMid.length}`);
        console.log('中级人员空闲名单数据:', JSON.stringify(idleMid, null, 2));
        console.log('准备写入空闲分析表，字段ID:', idleMidWorkersFieldId);

        if (idleMidWorkersFieldId) {
            console.log('开始写入中级人员空闲名单...');
            try {
              const idleMidField = await idleTable.getField(idleMidWorkersFieldId);
              console.log(`写入中级人员空闲名单到记录ID: ${recordId}`);
              await idleMidField.setValue(recordId, idleMid.join(', ') || '');
              console.log('中级人员空闲名单写入成功');
            } catch (error) {
              console.error('中级人员空闲名单写入失败:', error);
            }
          } else {
            console.error('中级人员空闲名单字段ID不存在，无法写入');
          console.log(`已更新中级人员空闲名单: ${idleMid.join(', ')}`);
        }
        if (idleMidCountFieldId) {
          const idleMidCountField = await idleTable.getField(idleMidCountFieldId);
          console.log(`写入中级人员空闲数量到记录ID: ${recordId}`);
          await idleMidCountField.setValue(recordId, idleMid.length);
          console.log(`已更新中级人员空闲数量: ${idleMid.length}`);
        }

        // 处理高级人员
        //console.log('高级人员名单字段ID:', seniorWorkersFieldId);
        const totalSeniorValue = totalRecord.fields[seniorWorkersFieldId!];
        //console.log('高级人员名单原始值:', JSON.stringify(totalSeniorValue, null, 2));
        const totalSeniorItems = Array.isArray(totalSeniorValue) ? totalSeniorValue : [totalSeniorValue];
        const totalSenior = totalSeniorItems.flatMap((item, index) => {
          if (!item || typeof item !== 'object') {
            console.log(`高级人员名单项[${index}]格式无效:`, item);
            return [];
          }
          const text = item.text?.trim();
          if (!text) {
            console.log(`高级人员名单项[${index}]文本为空:`, item);
            return [];
          }
          return text.split(',').map((t: string) => t.trim()).filter(Boolean);
        });
        //console.log('高级人员名单解析结果:', totalSenior);
        
        const occupiedSeniorValue = occupiedRecord.fields[occupiedSeniorWorkersFieldId!];
          //console.log('高级人员占用名单原始值:', JSON.stringify(occupiedSeniorValue, null, 2));
          const occupiedSeniorItems = Array.isArray(occupiedSeniorValue) ? occupiedSeniorValue : [occupiedSeniorValue];
          const occupiedSenior = occupiedSeniorItems.flatMap((item, index) => {
            if (!item || typeof item !== 'object') {
              console.log(`高级人员占用名单项[${index}]格式无效:`, item);
              return [];
            }
            const text = item.text?.trim();
            if (!text) {
              console.log(`高级人员占用名单项[${index}]文本为空:`, item);
              return [];
            }
            return text.split(',').map((t: string) => t.trim()).filter(Boolean);
          });
          //console.log('高级人员占用名单解析结果:', occupiedSenior);
        
        const idleSenior = totalSenior.filter((name: string): boolean => 
          !occupiedSenior.includes(name)
        ).filter(Boolean);
        console.log(`高级人员空闲计算: 总量=${totalSenior.length}, 占用=${occupiedSenior.length}, 空闲=${idleSenior.length}`);
        console.log('高级人员空闲名单数据:', JSON.stringify(idleSenior, null, 2));
        console.log('准备写入空闲分析表，字段ID:', idleSeniorWorkersFieldId);

        if (idleSeniorWorkersFieldId) {
            console.log('开始写入高级人员空闲名单...');
            try {
              const idleSeniorField = await idleTable.getField(idleSeniorWorkersFieldId);
              console.log(`写入高级人员空闲名单到记录ID: ${recordId}`);
              await idleSeniorField.setValue(recordId, idleSenior.join(', ') || '');
              console.log('高级人员空闲名单写入成功');
            } catch (error) {
              console.error('高级人员空闲名单写入失败:', error);
            }
          } else {
            console.error('高级人员空闲名单字段ID不存在，无法写入');
          console.log(`已更新高级人员空闲名单: ${idleSenior.join(', ')}`);
        }
        if (idleSeniorCountFieldId) {
          const idleSeniorCountField = await idleTable.getField(idleSeniorCountFieldId);
          console.log(`写入高级人员空闲数量到记录ID: ${recordId}`);
          await idleSeniorCountField.setValue(recordId, idleSenior.length);
          console.log(`已更新高级人员空闲数量: ${idleSenior.length}`);
        }

        // 处理显示器
        //console.log('显示器字段ID:', monitorListFieldId);
        const totalMonitorValue = totalRecord.fields[monitorListFieldId!];
        //console.log('显示器原始值:', JSON.stringify(totalMonitorValue, null, 2));
        const totalMonitorItems = Array.isArray(totalMonitorValue) ? totalMonitorValue : [totalMonitorValue];
        const totalMonitor = totalMonitorItems.flatMap((item, index) => {
          if (!item || typeof item !== 'object') {
            console.log(`显示器项[${index}]格式无效:`, item);
            return [];
          }
          const text = item.text?.trim();
          if (!text) {
            console.log(`显示器项[${index}]文本为空:`, item);
            return [];
          }
          return text.split(',').map((t: string) => t.trim()).filter(Boolean);
        });
        //console.log('显示器解析结果:', totalMonitor);
        
        const occupiedMonitorValue = occupiedRecord.fields[occupiedMonitorListFieldId!];
          //console.log('显示器占用原始值:', JSON.stringify(occupiedMonitorValue, null, 2));
          const occupiedMonitorItems = Array.isArray(occupiedMonitorValue) ? occupiedMonitorValue : [occupiedMonitorValue];
          const occupiedMonitor = occupiedMonitorItems.flatMap((item, index) => {
            if (!item || typeof item !== 'object') {
              console.log(`显示器占用项[${index}]格式无效:`, item);
              return [];
            }
            const text = item.text?.trim();
            if (!text) {
              console.log(`显示器占用项[${index}]文本为空:`, item);
              return [];
            }
            return text.split(',').map((t: string) => t.trim()).filter(Boolean);
          });
          //console.log('显示器占用解析结果:', occupiedMonitor);
        
        const idleMonitor = totalMonitor.filter((item: string): boolean => 
          !occupiedMonitor.includes(item)
        ).filter(Boolean);
        console.log(`显示器空闲计算: 总量=${totalMonitor.length}, 占用=${occupiedMonitor.length}, 空闲=${idleMonitor.length}`);
        console.log('显示器空闲名单数据:', JSON.stringify(idleMonitor, null, 2));
        console.log('准备写入空闲分析表，字段ID:', idleMonitorListFieldId);

        if (idleMonitorListFieldId) {
            console.log('开始写入显示器空闲名单...');
            try {
              const idleMonitorField = await idleTable.getField(idleMonitorListFieldId);
              console.log(`写入显示器空闲名单到记录ID: ${recordId}`);
              await idleMonitorField.setValue(recordId, idleMonitor.join(', ') || '');
              console.log('显示器空闲名单写入成功');
            } catch (error) {
              console.error('显示器空闲名单写入失败:', error);
            }
          } else {
            console.error('显示器空闲名单字段ID不存在，无法写入');
          console.log(`已更新显示器空闲清单: ${idleMonitor.join(', ')}`);
        }
        if (idleMonitorCountFieldId) {
          const idleMonitorCountField = await idleTable.getField(idleMonitorCountFieldId);
          console.log(`写入显示器空闲数量到记录ID: ${recordId}`);
          await idleMonitorCountField.setValue(recordId, idleMonitor.length);
          console.log(`已更新显示器空闲数量: ${idleMonitor.length}`);
        }

        // 处理翻页电脑
        //console.log('翻页电脑字段ID:', pageTurnerListFieldId);
        const totalPageTurnerValue = totalRecord.fields[pageTurnerListFieldId!];
        //console.log('翻页电脑原始值:', JSON.stringify(totalPageTurnerValue, null, 2));
        const totalPageTurnerItems = Array.isArray(totalPageTurnerValue) ? totalPageTurnerValue : [totalPageTurnerValue];
        const totalPageTurner = totalPageTurnerItems.flatMap((item, index) => {
          if (!item || typeof item !== 'object') {
            console.log(`翻页电脑项[${index}]格式无效:`, item);
            return [];
          }
          const text = item.text?.trim();
          if (!text) {
            console.log(`翻页电脑项[${index}]文本为空:`, item);
            return [];
          }
          return text.split(',').map((t: string) => t.trim()).filter(Boolean);
        });
        //console.log('翻页电脑解析结果:', totalPageTurner);
        
        const occupiedPageTurnerValue = occupiedRecord.fields[occupiedPageTurnerListFieldId!];
          //console.log('翻页电脑占用原始值:', JSON.stringify(occupiedPageTurnerValue, null, 2));
          const occupiedPageTurnerItems = Array.isArray(occupiedPageTurnerValue) ? occupiedPageTurnerValue : [occupiedPageTurnerValue];
          const occupiedPageTurner = occupiedPageTurnerItems.flatMap((item, index) => {
            if (!item || typeof item !== 'object') {
              console.log(`翻页电脑占用项[${index}]格式无效:`, item);
              return [];
            }
            const text = item.text?.trim();
            if (!text) {
              console.log(`翻页电脑占用项[${index}]文本为空:`, item);
              return [];
            }
            return text.split(',').map((t: string) => t.trim()).filter(Boolean);
          });
          //console.log('翻页电脑占用解析结果:', occupiedPageTurner);
        
        const idlePageTurner = totalPageTurner.filter((item: string): boolean => 
          !occupiedPageTurner.includes(item)
        ).filter(Boolean);
        console.log(`翻页电脑空闲计算: 总量=${totalPageTurner.length}, 占用=${occupiedPageTurner.length}, 空闲=${idlePageTurner.length}`);
        console.log('翻页电脑空闲名单数据:', JSON.stringify(idlePageTurner, null, 2));
        console.log('准备写入空闲分析表，字段ID:', idlePageTurnerListFieldId);

        if (idlePageTurnerListFieldId) {
            console.log('开始写入翻页电脑空闲名单...');
            try {
              const idlePageTurnerField = await idleTable.getField(idlePageTurnerListFieldId);
              console.log(`写入翻页电脑空闲名单到记录ID: ${recordId}`);
              await idlePageTurnerField.setValue(recordId, idlePageTurner.join(', ') || '');
              console.log('翻页电脑空闲名单写入成功');
            } catch (error) {
              console.error('翻页电脑空闲名单写入失败:', error);
            }
          } else {
            console.error('翻页电脑空闲名单字段ID不存在，无法写入');
          console.log(`已更新翻页电脑空闲清单: ${idlePageTurner.join(', ')}`);
        }
        if (idlePageTurnerCountFieldId) {
          const idlePageTurnerCountField = await idleTable.getField(idlePageTurnerCountFieldId);
          console.log(`写入翻页电脑空闲数量到记录ID: ${recordId}`);
          await idlePageTurnerCountField.setValue(recordId, idlePageTurner.length);
          console.log(`已更新翻页电脑空闲数量: ${idlePageTurner.length}`);
        }

        // 处理高性能电脑
        console.log('高性能电脑字段ID:', highPerfPCListFieldId);
        const totalHighPerfPCValue = totalRecord.fields[highPerfPCListFieldId!];
        console.log('高性能电脑原始值:', JSON.stringify(totalHighPerfPCValue, null, 2));
        const totalHighPerfPCItems = Array.isArray(totalHighPerfPCValue) ? totalHighPerfPCValue : [totalHighPerfPCValue];
        const totalHighPerfPC = totalHighPerfPCItems.flatMap((item, index) => {
          if (!item || typeof item !== 'object') {
            console.log(`高性能电脑项[${index}]格式无效:`, item);
            return [];
          }
          const text = item.text?.trim();
          if (!text) {
            console.log(`高性能电脑项[${index}]文本为空:`, item);
            return [];
          }
          return text.split(',').map((t: string) => t.trim()).filter(Boolean);
        });
        console.log('高性能电脑解析结果:', totalHighPerfPC);
        
        const occupiedHighPerfPCValue = occupiedRecord.fields[occupiedHighPerfPCListFieldId!];
          //console.log('高性能电脑占用原始值:', JSON.stringify(occupiedHighPerfPCValue, null, 2));
          const occupiedHighPerfPCItems = Array.isArray(occupiedHighPerfPCValue) ? occupiedHighPerfPCValue : [occupiedHighPerfPCValue];
          const occupiedHighPerfPC = occupiedHighPerfPCItems.flatMap((item, index) => {
            if (!item || typeof item !== 'object') {
              console.log(`高性能电脑占用项[${index}]格式无效:`, item);
              return [];
            }
            const text = item.text?.trim();
            if (!text) {
              console.log(`高性能电脑占用项[${index}]文本为空:`, item);
              return [];
            }
            return text.split(',').map((t: string) => t.trim()).filter(Boolean);
          });
          //console.log('高性能电脑占用解析结果:', occupiedHighPerfPC);
        
        const idleHighPerfPC = totalHighPerfPC.filter((item: string): boolean => 
          !occupiedHighPerfPC.includes(item)
        ).filter(Boolean);
        console.log(`高性能电脑空闲计算: 总量=${totalHighPerfPC.length}, 占用=${occupiedHighPerfPC.length}, 空闲=${idleHighPerfPC.length}`);
        console.log('高性能电脑空闲名单数据:', JSON.stringify(idleHighPerfPC, null, 2));
        console.log('准备写入空闲分析表，字段ID:', idleHighPerfPCListFieldId);

        if (idleHighPerfPCListFieldId) {
            console.log('开始写入高性能电脑空闲名单...');
            try {
              const idleHighPerfPCField = await idleTable.getField(idleHighPerfPCListFieldId);
              console.log(`写入高性能电脑空闲名单到记录ID: ${recordId}`);
              await idleHighPerfPCField.setValue(recordId, idleHighPerfPC.join(', ') || '');
              console.log('高性能电脑空闲名单写入成功');
            } catch (error) {
              console.error('高性能电脑空闲名单写入失败:', error);
            }
          } else {
            console.error('高性能电脑空闲名单字段ID不存在，无法写入');
          console.log(`已更新高性能电脑空闲清单: ${idleHighPerfPC.join(', ')}`);
        }
        if (idleHighPerfPCCountFieldId) {
          const idleHighPerfPCCountField = await idleTable.getField(idleHighPerfPCCountFieldId);
          console.log(`写入高性能电脑空闲数量到记录ID: ${recordId}`);
          await idleHighPerfPCCountField.setValue(recordId, idleHighPerfPC.length);
          console.log(`已更新高性能电脑空闲数量: ${idleHighPerfPC.length}`);
        }

        // 处理会议账号
        console.log('会议账号字段ID:', accountListFieldId);
        const totalAccountValue = totalRecord.fields[accountListFieldId!];
        //console.log('会议账号原始值:', JSON.stringify(totalAccountValue, null, 2));
        const totalAccountItems = Array.isArray(totalAccountValue) ? totalAccountValue : [totalAccountValue];
        const totalAccount = totalAccountItems.flatMap((item, index) => {
          if (!item || typeof item !== 'object') {
            console.log(`会议账号项[${index}]格式无效:`, item);
            return null;
          }
          const text = item.text?.trim();
          if (!text) console.log(`会议账号项[${index}]文本为空:`, item);
          return text.split(',').map((t: string) => t.trim());
        }).filter(Boolean);
        //console.log('会议账号解析结果:', totalAccount);
        
        const occupiedAccountValue = occupiedRecord.fields[occupiedAccountListFieldId!];
          //console.log('会议账号占用原始值:', JSON.stringify(occupiedAccountValue, null, 2));
          const occupiedAccountItems = Array.isArray(occupiedAccountValue) ? occupiedAccountValue : [occupiedAccountValue];
          const occupiedAccount = occupiedAccountItems.flatMap((item, index) => {
            if (!item || typeof item !== 'object') {
              console.log(`会议账号占用项[${index}]格式无效:`, item);
              return null;
            }
            const text = item.text?.trim();
            if (!text) console.log(`会议账号占用项[${index}]文本为空:`, item);
            return text.split(',').map((t: string) => t.trim());
          }).filter(Boolean);
          //console.log('会议账号占用解析结果:', occupiedAccount);
        
        const idleAccount = totalAccount.filter((item: string): boolean => 
          !occupiedAccount.includes(item)
        ).filter(Boolean);
        console.log(`会议账号空闲计算: 总量=${totalAccount.length}, 占用=${occupiedAccount.length}, 空闲=${idleAccount.length}`);
        console.log('会议账号空闲名单数据:', JSON.stringify(idleAccount, null, 2));
        console.log('准备写入空闲分析表，字段ID:', idleAccountListFieldId);

        if (idleAccountListFieldId) {
            console.log('开始写入会议账号空闲名单...');
            try {
              const idleAccountField = await idleTable.getField(idleAccountListFieldId);
              console.log(`写入会议账号空闲名单到记录ID: ${recordId}`);
              await idleAccountField.setValue(recordId, idleAccount.join(', ') || '');
              console.log('会议账号空闲名单写入成功');
            } catch (error) {
              console.error('会议账号空闲名单写入失败:', error);
            }
          } else {
            console.error('会议账号空闲名单字段ID不存在，无法写入');
          console.log(`已更新会议账号空闲清单: ${idleAccount.join(', ')}`);
        }
        if (idleAccountCountFieldId) {
          const idleAccountCountField = await idleTable.getField(idleAccountCountFieldId);
          console.log(`写入会议账号空闲数量到记录ID: ${recordId}`);
          await idleAccountCountField.setValue(recordId, idleAccount.length);
          console.log(`已更新会议账号空闲数量: ${idleAccount.length}`);
        }

        // 更新完成
      }

      console.log('资源空闲分析计算完成');
    } catch (error) {
      console.error('资源空闲分析失败:', error);
      console.error('分析失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, [resourceTotalTableId, resourceOccupiedTableId, resourceIdleTableId, idleStartFieldId, idleEndFieldId, totalStartFieldId, totalEndFieldId, juniorWorkersFieldId, occupiedJuniorWorkersFieldId, idleJuniorWorkersFieldId, idleJuniorCountFieldId, midWorkersFieldId, occupiedMidWorkersFieldId, idleMidWorkersFieldId, idleMidCountFieldId, seniorWorkersFieldId, occupiedSeniorWorkersFieldId, idleSeniorWorkersFieldId, idleSeniorCountFieldId, monitorListFieldId, occupiedMonitorListFieldId, idleMonitorListFieldId, idleMonitorCountFieldId, pageTurnerListFieldId, occupiedPageTurnerListFieldId, idlePageTurnerListFieldId, idlePageTurnerCountFieldId, highPerfPCListFieldId, occupiedHighPerfPCListFieldId, idleHighPerfPCListFieldId, idleHighPerfPCCountFieldId, accountListFieldId, occupiedAccountListFieldId, idleAccountListFieldId, idleAccountCountFieldId]);

  return (
    <Form<{}> labelPosition='top' style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* 资源总量分析表选择区域 */}
      <h4>1. 选择资源总量分析表</h4>
      <Form.Slot>
        <Select
          value={resourceTotalTableId}
          onChange={(value) => setResourceTotalTableId(value as string)}
          placeholder="请选择资源总量分析表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>

      {resourceTotalTableId && (
        <div className="table-fields-container">
          <Form.Slot>
            <Select value={totalStartFieldId} onChange={(v) => setTotalStartFieldId(v as string)} placeholder="资源分析开始时间字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={totalEndFieldId} onChange={(v) => setTotalEndFieldId(v as string)} placeholder="资源分析结束时间字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={juniorWorkersFieldId} onChange={(v) => setJuniorWorkersFieldId(v as string)} placeholder="初级人员名单字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={juniorCountFieldId} onChange={(v) => setJuniorCountFieldId(v as string)} placeholder="初级人员数量字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={midWorkersFieldId} onChange={(v) => setMidWorkersFieldId(v as string)} placeholder="中级人员名单字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={midCountFieldId} onChange={(v) => setMidCountFieldId(v as string)} placeholder="中级人员数量字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={seniorWorkersFieldId} onChange={(v) => setSeniorWorkersFieldId(v as string)} placeholder="高级人员名单字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={seniorCountFieldId} onChange={(v) => setSeniorCountFieldId(v as string)} placeholder="高级人员数量字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={monitorListFieldId} onChange={(v) => setMonitorListFieldId(v as string)} placeholder="显示器清单字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={monitorCountFieldId} onChange={(v) => setMonitorCountFieldId(v as string)} placeholder="显示器数量字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={pageTurnerListFieldId} onChange={(v) => setPageTurnerListFieldId(v as string)} placeholder="翻页电脑清单字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={pageTurnerCountFieldId} onChange={(v) => setPageTurnerCountFieldId(v as string)} placeholder="翻页电脑数量字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={highPerfPCListFieldId} onChange={(v) => setHighPerfPCListFieldId(v as string)} placeholder="高性能电脑清单字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={highPerfPCCountFieldId} onChange={(v) => setHighPerfPCCountFieldId(v as string)} placeholder="高性能电脑数量字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={accountListFieldId} onChange={(v) => setAccountListFieldId(v as string)} placeholder="会议账号清单字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={accountCountFieldId} onChange={(v) => setAccountCountFieldId(v as string)} placeholder="会议账号数量字段">
              {totalTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
        </div>
      )}

      <hr className="form-divider"/>

      {/* 资源占用分析表选择区域 */}
      <h4>2. 选择资源占用分析表</h4>
      <Form.Slot>
        <Select
          value={resourceOccupiedTableId}
          onChange={(value) => setResourceOccupiedTableId(value as string)}
          placeholder="请选择资源占用分析表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>

      {resourceOccupiedTableId && (
        <div className="table-fields-container">
          <Form.Slot>
            <Select value={occupiedStartFieldId} onChange={(v) => setOccupiedStartFieldId(v as string)} placeholder="资源分析开始时间字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedEndFieldId} onChange={(v) => setOccupiedEndFieldId(v as string)} placeholder="资源分析结束时间字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedJuniorWorkersFieldId} onChange={(v) => setOccupiedJuniorWorkersFieldId(v as string)} placeholder="占用初级人员名单字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedJuniorCountFieldId} onChange={(v) => setOccupiedJuniorCountFieldId(v as string)} placeholder="占用初级人员数量字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedMidWorkersFieldId} onChange={(v) => setOccupiedMidWorkersFieldId(v as string)} placeholder="占用中级人员名单字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedMidCountFieldId} onChange={(v) => setOccupiedMidCountFieldId(v as string)} placeholder="占用中级人员数量字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedSeniorWorkersFieldId} onChange={(v) => setOccupiedSeniorWorkersFieldId(v as string)} placeholder="占用高级人员名单字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedSeniorCountFieldId} onChange={(v) => setOccupiedSeniorCountFieldId(v as string)} placeholder="占用高级人员数量字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedMonitorListFieldId} onChange={(v) => setOccupiedMonitorListFieldId(v as string)} placeholder="占用显示器清单字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={occupiedMonitorCountFieldId} onChange={(v) => setOccupiedMonitorCountFieldId(v as string)} placeholder="占用显示器数量字段">
              {occupiedTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
              <Select value={occupiedPageTurnerListFieldId} onChange={(v) => setOccupiedPageTurnerListFieldId(v as string)} placeholder="占用翻页电脑清单字段">
                {occupiedTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={occupiedPageTurnerCountFieldId} onChange={(v) => setOccupiedPageTurnerCountFieldId(v as string)} placeholder="占用翻页电脑数量字段">
                {occupiedTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={occupiedHighPerfPCListFieldId} onChange={(v) => setOccupiedHighPerfPCListFieldId(v as string)} placeholder="占用高性能电脑清单字段">
                {occupiedTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={occupiedHighPerfPCCountFieldId} onChange={(v) => setOccupiedHighPerfPCCountFieldId(v as string)} placeholder="占用高性能电脑数量字段">
                {occupiedTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={occupiedAccountListFieldId} onChange={(v) => setOccupiedAccountListFieldId(v as string)} placeholder="占用会议账号清单字段">
                {occupiedTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={occupiedAccountCountFieldId} onChange={(v) => setOccupiedAccountCountFieldId(v as string)} placeholder="占用会议账号数量字段">
                {occupiedTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
        </div>
      )}

      <hr className="form-divider"/>

      {/* 资源空闲分析表选择区域 */}
      <h4>3. 选择资源空闲分析表</h4>
      <Form.Slot>
        <Select
          value={resourceIdleTableId}
          onChange={(value) => setResourceIdleTableId(value as string)}
          placeholder="请选择资源空闲分析表"
        >
          {tableList.map(({ name, id }) => (
            <Select.Option key={id} value={id}>{name}</Select.Option>
          ))}
        </Select>
      </Form.Slot>

      {resourceIdleTableId && (
        <div className="table-fields-container">
          <Form.Slot>
            <Select value={idleStartFieldId} onChange={(v) => setIdleStartFieldId(v as string)} placeholder="空闲分析开始时间字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleEndFieldId} onChange={(v) => setIdleEndFieldId(v as string)} placeholder="空闲分析结束时间字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleJuniorWorkersFieldId} onChange={(v) => setIdleJuniorWorkersFieldId(v as string)} placeholder="空闲初级人员名单字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleJuniorCountFieldId} onChange={(v) => setIdleJuniorCountFieldId(v as string)} placeholder="空闲初级人员数量字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleMidWorkersFieldId} onChange={(v) => setIdleMidWorkersFieldId(v as string)} placeholder="空闲中级人员名单字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleMidCountFieldId} onChange={(v) => setIdleMidCountFieldId(v as string)} placeholder="空闲中级人员数量字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleSeniorWorkersFieldId} onChange={(v) => setIdleSeniorWorkersFieldId(v as string)} placeholder="空闲高级人员名单字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleSeniorCountFieldId} onChange={(v) => setIdleSeniorCountFieldId(v as string)} placeholder="空闲高级人员数量字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleMonitorListFieldId} onChange={(v) => setIdleMonitorListFieldId(v as string)} placeholder="空闲显示器清单字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
            <Select value={idleMonitorCountFieldId} onChange={(v) => setIdleMonitorCountFieldId(v as string)} placeholder="空闲显示器数量字段">
              {idleTableFields.map(field => (
                <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
              ))}
            </Select>
          </Form.Slot>
          <Form.Slot>
              <Select value={idlePageTurnerListFieldId} onChange={(v) => setIdlePageTurnerListFieldId(v as string)} placeholder="空闲翻页电脑清单字段">
                {idleTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={idlePageTurnerCountFieldId} onChange={(v) => setIdlePageTurnerCountFieldId(v as string)} placeholder="空闲翻页电脑数量字段">
                {idleTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={idleHighPerfPCListFieldId} onChange={(v) => setIdleHighPerfPCListFieldId(v as string)} placeholder="空闲高性能电脑清单字段">
                {idleTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={idleHighPerfPCCountFieldId} onChange={(v) => setIdleHighPerfPCCountFieldId(v as string)} placeholder="空闲高性能电脑数量字段">
                {idleTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={idleAccountListFieldId} onChange={(v) => setIdleAccountListFieldId(v as string)} placeholder="空闲会议账号清单字段">
                {idleTableFields.map(field => (
                  <Select.Option key={field.id} value={field.id}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Slot>
          <Form.Slot>
              <Select value={idleAccountCountFieldId} onChange={(v) => setIdleAccountCountFieldId(v as string)} placeholder="空闲会议账号数量字段">
                {idleTableFields.map(field => (
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