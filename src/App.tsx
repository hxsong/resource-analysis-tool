import './App.css';
import { useState, useEffect } from 'react';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { bitable, ITableMeta } from '@lark-base-open/js-sdk';
import PersonAnalysis from './components/analysis/PersonAnalysis';
import DeviceAnalysis from './components/analysis/DeviceAnalysis';
import ResourceUsageAnalysis from './components/analysis/ResourceUsageAnalysis';
import AccountAnalysis from './components/analysis/AccountAnalysis';
import ResourceIdleAnalysis from './components/analysis/ResourceIdleAnalysis';

export default function App() {
  const [tableList, setTableList] = useState<ITableMeta[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tables = await bitable.base.getTableMetaList();
        setTableList(tables);
      } catch (error) {
        console.error('获取表格列表失败:', error);
      }
    };

    fetchTables();
  }, []);
  return (
    <main className="main">
      <br/><h5>【资源分析插件】｜请按表单顺序操作进行使用</h5><br/>
      <hr className="section-divider"/>
      <br/>
      <Tabs type="button">
        <TabPane tab="人员总量分析" itemKey="1">
          <hr className="form-divider"/>
          <PersonAnalysis tableList={tableList} />
        </TabPane>
        <TabPane tab="设备总量分析" itemKey="2">
          <hr className="form-divider"/>
          <DeviceAnalysis tableList={tableList} />
        </TabPane>
        <TabPane tab="账号总量分析" itemKey="3">
          <hr className="form-divider"/>
          <AccountAnalysis tableList={tableList} />
        </TabPane>
        <TabPane tab="资源使用分析" itemKey="4">
          <hr className="form-divider"/>
          <ResourceUsageAnalysis tableList={tableList} />
        </TabPane>
        <TabPane tab="资源空闲分析" itemKey="5">
          <hr className="form-divider"/>
          <ResourceIdleAnalysis tableList={tableList} />
        </TabPane>
      </Tabs>
    </main>
  );
}