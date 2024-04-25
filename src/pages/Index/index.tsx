import { listInterfaceInfoByPageUsingPost } from '@/services/ybapi-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { List, message } from 'antd';
import React from 'react';
// 主页
const Index: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [list, setList] = React.useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = React.useState<number>(0);

  const defaultPageSize: number = 5;
  const loadData = async (current: number = 1, pageSize: number = defaultPageSize) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingPost({
        current,
        pageSize,
      });
      setLoading(false);
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);

      return true;
    } catch (error) {
      setLoading(false);
      // @ts-ignore
      message.error('加载失败，' + error.message);
      return false;
    }
  };
  React.useEffect(() => {
    loadData();
  }, []);
  return (
    <PageContainer title="在线接口开放平台">
      <List
        className="my-list"
        loading={loading}
        itemLayout="vertical"
        size="large"
        pagination={{
          showTotal(total) {
            return '共 ' + total + ' 条';
          },
          pageSize: defaultPageSize,
          total: total,
          onChange(page, pageSize) {
            if (page !== 1) {
              loadData(page, pageSize);
            }
          },
        }}
        dataSource={list}
        footer={
          <div>
            <b>yb-api</b> footer part
          </div>
        }
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item
              key={item.id}
              actions={[
                <a
                  key={item.id}
                  onClick={() => {
                    history.push(apiLink);
                  }}
                >
                  查看
                </a>,
              ]}
            >
              <List.Item.Meta
                title={
                  <a
                    onClick={() => {
                      history.push(apiLink);
                    }}
                  >
                    {item.name}
                  </a>
                }
              />
            </List.Item>
          );
        }}
      />
    </PageContainer>
  );
};

export default Index;
