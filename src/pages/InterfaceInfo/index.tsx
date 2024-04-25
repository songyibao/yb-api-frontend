import { getInterfaceInfoVoByIdUsingGet } from '@/services/ybapi-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Descriptions, DescriptionsProps, message } from 'antd';
import React from 'react';
import { useParams } from 'react-router';
// 主页
const Index: React.FC = () => {
  const [data, setData] = React.useState<API.InterfaceInfo>();

  const params = useParams();
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '描述',
      children: <p>{data?.description}</p>,
    },
    {
      key: '1',
      label: '请求方式',
      children: <p>{data?.method}</p>,
    },
    {
      key: '2',
      label: '请求地址',
      children: <p>{data?.url}</p>,
    },
    {
      key: '3',
      label: '请求头',
      children: <p>{data?.requestHeader}</p>,
    },
    {
      key: '4',
      label: '响应头',
      children: <p>{data?.responseHeader}</p>,
    },
    {
      key: '5',
      label: '最后更新时间',
      children: <p>{data?.updateTime}</p>,
    },
    {
      key: '6',
      label: '接口状态',
      children:
        data?.status === 1 ? (
          <p style={{ color: 'green' }}>正常</p>
        ) : (
          <p style={{ color: 'red' }}>关闭</p>
        ),
    },
  ];

  const loadData = async () => {
    if (!params.id) {
      message.error('参数id不存在');
      return;
    }
    const hide = message.loading('正在加载');
    const res = await getInterfaceInfoVoByIdUsingGet({
      id: Number(params.id),
    });
    hide();
    if (res.success) {
      setData(res.data);
      return true;
    } else {
      message.error('加载失败');
      return false;
    }
  };
  React.useEffect(() => {
    loadData();
  }, []);
  return (
    <PageContainer title="接口文档">
      {/*{JSON.stringify(data, null, 2)}*/}
      <Card>
        {data ? <Descriptions title={data?.name} items={items} column={1} /> : <>接口不存在</>}
      </Card>
    </PageContainer>
  );
};

export default Index;
