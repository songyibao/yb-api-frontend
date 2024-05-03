import { CloseCircleOutlined, SmileOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProColumns,
  ProFormCheckbox,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
export type Props = {
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: (flag?: boolean, formVals?: API.InterfaceInfo) => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
};
const CreateModal: React.FC<Props> = (props) => {
  const { visible, onCancel, onSubmit } = props;
  return (
    <ModalForm
      open={visible}
      onFinish={async (value) => {
        onSubmit?.(value as API.InterfaceInfo);
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          onCancel?.();
        },
      }}
    >
      <ProFormText name="name" label="接口名称" />
      <ProFormText name="description" label="接口描述" />
      <ProFormSelect
        name="method"
        label="请求方法"
        options={[
          {
            value: 'POST',
            label: 'POST',
          },
          {
            value: 'GET',
            label: 'GET',
          },
        ]}
      />
      <ProFormText name="url" label="接口地址" />
      <ProFormList
        name="requestHeader"
        label="请求头"
        copyIconProps={{ Icon: SmileOutlined, tooltipText: '复制此项到末尾' }}
        deleteIconProps={{
          Icon: CloseCircleOutlined,
          tooltipText: '删除',
        }}
      >
        <ProFormGroup key="group">
          <ProFormText name="key" label="key" />
          <ProFormText name="value" label="value" />
        </ProFormGroup>
      </ProFormList>
      <ProFormList
        name="requestParams"
        label="请求参数"
        copyIconProps={{ Icon: SmileOutlined, tooltipText: '复制此项到末尾' }}
        deleteIconProps={{
          Icon: CloseCircleOutlined,
          tooltipText: '删除',
        }}
      >
        <ProFormGroup key="group">
          <ProFormText name="name" label="name" />
          <ProFormSelect
            name="type"
            label="type"
            options={[
              {
                value: 'Number',
                label: 'Number',
              },
              {
                value: 'String',
                label: 'String',
              },
              {
                value: 'Boolean',
                label: 'Boolean',
              },
              {
                value: 'Array',
                label: 'Array',
              },
              {
                value: 'Value',
                label: 'Value',
              },
              {
                value: 'Object',
                label: 'Object',
              },
              {
                value: 'Whitespace',
                label: 'Whitespace',
              },
            ]}
          />
          <ProFormCheckbox name="required" label="required" />
        </ProFormGroup>
      </ProFormList>
      <ProFormList
        name="responseHeader"
        label="响应头"
        copyIconProps={{ Icon: SmileOutlined, tooltipText: '复制此项到末尾' }}
        deleteIconProps={{
          Icon: CloseCircleOutlined,
          tooltipText: '删除',
        }}
      >
        <ProFormGroup key="group">
          <ProFormText name="key" label="key" />
          <ProFormText name="value" label="value" />
        </ProFormGroup>
      </ProFormList>
    </ModalForm>
  );
};
export default CreateModal;
