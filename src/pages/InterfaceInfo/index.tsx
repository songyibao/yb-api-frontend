import {
  getInterfaceInfoVoByIdUsingGet,
  invokeInterfaceUsingPost,
} from '@/services/ybapi-backend/interfaceInfoController';
import {
  FormProps,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Editor } from '@monaco-editor/react';
import { Button, Form, message } from 'antd';
import { forEach } from 'lodash';
import React, { useRef } from 'react';
import { useParams } from 'react-router';
// 主页
const Index: React.FC = () => {
  const [data, setData] = React.useState<API.InterfaceInfo>();
  const [requestEditorDone, setRequestEditorDone] = React.useState<boolean>(false);
  const [, setResponseEditorDone] = React.useState<boolean>(false);
  const params = useParams();
  const requestHeaderColumns: ProColumns<{ key: string; value: string }>[] = [
    {
      title: 'key',
      dataIndex: 'key',
    },
    {
      title: 'value',
      dataIndex: 'value',
    },
  ];
  const requestParamsColumns: ProColumns<{ key: string; value: string }>[] = [
    {
      title: '参数名称',
      dataIndex: 'name',
    },
    {
      title: '参数类型',
      dataIndex: 'type',
    },
  ];
  const responseHeaderColumns: ProColumns<{ key: string; value: string }>[] = [
    {
      title: 'key',
      dataIndex: 'key',
    },
    {
      title: 'value',
      dataIndex: 'value',
    },
  ];
  const requestEditorRef = useRef(null);
  const responseEditorRef = useRef(null);
  const handleRequestEditorDidMount = (editor: any) => {
    requestEditorRef.current = editor;
    setRequestEditorDone(true);
  };
  const handleResponseEditorDidMount = (editor: any) => {
    responseEditorRef.current = editor;
    setResponseEditorDone(true);
  };

  const loadData = async () => {
    console.log('loading data');
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
  const onFinish: FormProps['onFinish'] = async (values) => {
    console.log('Success:', values);
    const res = await invokeInterfaceUsingPost({
      ...values,
      id: params.id,
    });
    if (res.success) {
      message.success('调用成功');
      responseEditorRef.current.setValue(JSON.stringify(res.data, null, 2));
    }
  };
  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  React.useEffect(() => {
    loadData();
  }, []);
  React.useEffect(() => {
    if (!data || requestEditorRef.current === null) {
      return;
    }
    const params: { name: string; type: string; required: boolean }[] = JSON.parse(
      data?.requestParams ?? '[]',
    );
    let code: Params = {};
    // 遍历data.requestParams，生成默认的请求参数
    // "[{"name":"username","type":"String","required":true}]" => {username: ''}
    forEach(params, (value) => {
      if (value.type === 'String') {
        code[value.name] = '';
      } else if (value.type === 'Number') {
        code[value.name] = 0;
      }
    });
    requestEditorRef.current.setValue(JSON.stringify(code, null, 2));
  }, [data, requestEditorDone]);
  return (
    <PageContainer title="接口文档">
      <ProDescriptions column={2} title={data?.name} layout="vertical">
        <ProDescriptions.Item
          span={2}
          valueType="text"
          contentStyle={{
            maxWidth: '80%',
          }}
          // renderText={(_) => {
          //   return _ + _;
          // }}
          ellipsis
          label="描述"
        >
          {data?.description}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间" valueType="dateTime" span={1}>
          {data?.createTime}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间" valueType="dateTime" span={1}>
          {data?.updateTime}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="请求头" valueType="text" span={1}>
          <ProTable
            pagination={false}
            columns={requestHeaderColumns}
            search={false}
            cardBordered={false}
            ghost={true}
            options={false}
            dataSource={data?.requestHeader ? JSON.parse(data?.requestHeader) : []}
            rowKey="key"
            dateFormatter="string"
            style={{ width: '90%' }}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="响应头" valueType="text" span={1}>
          <ProTable
            pagination={false}
            columns={responseHeaderColumns}
            search={false}
            cardBordered={false}
            ghost={true}
            options={false}
            dataSource={data?.responseHeader ? JSON.parse(data?.responseHeader) : []}
            rowKey="key"
            dateFormatter="string"
            style={{ width: '90%' }}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="请求参数" valueType="text" span={2}>
          <ProTable
            pagination={false}
            columns={requestParamsColumns}
            search={false}
            cardBordered={false}
            ghost={true}
            options={false}
            dataSource={data?.requestParams ? JSON.parse(data?.requestParams) : []}
            rowKey="key"
            dateFormatter="string"
            style={{ width: '45%' }}
          />
        </ProDescriptions.Item>
      </ProDescriptions>
      <Form name="invoke" onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
        <Form.Item label="在线调用" name="userRequestParams">
          <Editor height="12vh" defaultLanguage="JSON" onMount={handleRequestEditorDidMount} />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16 }}>
          <Button type="primary" htmlType="submit">
            调用
          </Button>
        </Form.Item>
        <Form.Item label="返回结果" name="userRequestResult">
          <Editor height="12vh" defaultLanguage="JSON" onMount={handleResponseEditorDidMount} />
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default Index;
