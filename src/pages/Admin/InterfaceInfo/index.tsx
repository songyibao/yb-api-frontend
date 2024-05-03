import CreateModal from '@/pages/Admin/InterfaceInfo/components/CreateModal';
import UpdateModal from '@/pages/Admin/InterfaceInfo/components/UpdateModal';
import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingPost,
  offlineInterfaceInfoUsingPost,
  onlineInterfaceInfoUsingPost,
  updateInterfaceInfoUsingPost,
} from '@/services/ybapi-backend/interfaceInfoController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [updateModalReadOnly, handleUpdateModalReadOnly] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);
  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    const res = await addInterfaceInfoUsingPost({
      ...fields,
      requestHeader: JSON.stringify(fields.requestHeader),
      requestParams: JSON.stringify(fields.requestParams),
      responseHeader: JSON.stringify(fields.responseHeader),
    });
    if (res.success) {
      hide();
      message.success('创建成功');
      handleModalOpen(false);
      actionRef.current?.reload();
      return true;
    } else {
      hide();
      return false;
    }
  };
  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    if (currentRow === undefined) return false;
    const hide = message.loading('Configuring');
    const res = await updateInterfaceInfoUsingPost({
      ...fields,
      id: currentRow.id,
      requestHeader: JSON.stringify(fields.requestHeader),
      requestParams: JSON.stringify(fields.requestParams),
      responseHeader: JSON.stringify(fields.responseHeader),
    });
    hide();
    if (res.success && res.data === true) {
      message.success('更新成功');
      return true;
    } else {
      return false;
    }
  };
  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (records: API.InterfaceInfo[]) => {
    const hide = message.loading('正在删除');
    if (!records.length) return true; // 检查数组是否为空
    let successCount: number = 0;
    let failCount: number = 0;
    for (const record of records) {
      // 遍历数组中的每个元素
      let res = await deleteInterfaceInfoUsingPost({
        id: record.id,
      });
      if (!(res.success && res.data === true)) {
        message.success('删除失败');
        failCount++;
      } else {
        successCount++;
      }
    }
    hide();
    message.success('成功删除' + successCount + '条记录，失败' + failCount + '条记录');
    actionRef.current?.reload();
    return true;
  };

  const handleOnline = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在发布');
    const res = await onlineInterfaceInfoUsingPost({
      id: record.id,
    });
    hide();
    if (res.success) {
      message.success('发布成功');
      actionRef.current?.reload();
    }
    return true;
  };

  const handleOffline = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在下线');
    const res = await offlineInterfaceInfoUsingPost({
      id: record.id,
    });
    hide();
    if (res.success) {
      message.success('下线成功');
      handleModalOpen(false);
      actionRef.current?.reload();
      return true;
    } else {
      return false;
    }
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '接口描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: '接口地址',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          详情
        </a>,
        <a
          key="config"
          onClick={() => {
            handleUpdateModalReadOnly(false);
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        record.status === 0 ? (
          <a
            key="config"
            style={{ color: 'green' }}
            onClick={() => {
              handleOnline(record);
            }}
          >
            发布
          </a>
        ) : null,
        record.status === 1 ? (
          <a
            type="text"
            key="config"
            style={{ color: 'red' }}
            onClick={() => {
              handleOffline(record);
            }}
          >
            下线
          </a>
        ) : null,
        // <a key="subscribeAlert" href="https://procomponents.ant.design/">
        //   订阅警报
        // </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.InterfaceInfo, API.PageParams>
        headerTitle={'接口信息'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (
          params: {
            pageSize?: number;
            current?: number;
            keyword?: string;
          },
          // sort: Record<string, SortOrder>,
          // filter: Record<string, (string | number)[] | null>,
        ) => {
          const res: any = await listInterfaceInfoByPageUsingPost({
            ...params,
          });
          if (res.success) {
            return {
              data: res.data.records || [],
              success: true,
              total: res.data.total,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <UpdateModal
        onSubmit={async (value) => {
          const res = await handleUpdate(value);
          if (res) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalReadOnly(true);
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
        columns={columns}
        readonly={updateModalReadOnly}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalOpen(false);
        }}
        onSubmit={(values) => {
          handleAdd(values);
        }}
        visible={createModalOpen}
      />
    </PageContainer>
  );
};
export default TableList;
