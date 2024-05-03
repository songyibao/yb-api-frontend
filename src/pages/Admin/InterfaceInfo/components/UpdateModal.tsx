import { FormValueType } from '@/pages/Admin/InterfaceInfo/components/CreateModal';
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
import { ProFormInstance } from '@ant-design/pro-form/lib';
import '@umijs/max';
import React, { useEffect, useRef } from 'react';

export type Props = {
  values: API.InterfaceInfo;
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
  readonly?: boolean;
};
const UpdateModal: React.FC<Props> = (props) => {
  const { values, visible, readonly, onCancel, onSubmit } = props;
  console.log(props);
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    formRef.current?.setFieldsValue(values);
  });
  console.log('values=>', values);
  return (
    <ModalForm
      readonly={readonly}
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
      <ProFormText name="name" label="接口名称" initialValue={values.name} />
      <ProFormText name="description" label="接口描述" initialValue={values.description} />
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
        initialValue={values.method}
      />
      <ProFormText name="url" label="接口地址" initialValue={values.url} />
      <ProFormList
        name="requestHeader"
        label="请求头"
        copyIconProps={{ Icon: SmileOutlined, tooltipText: '复制此项到末尾' }}
        deleteIconProps={{
          Icon: CloseCircleOutlined,
          tooltipText: '删除',
        }}
        initialValue={values.requestHeader ? JSON.parse(values.requestHeader as string) : []}
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
        initialValue={values.requestParams ? JSON.parse(values.requestParams as string) : []}
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
        initialValue={values.responseHeader ? JSON.parse(values.responseHeader as string) : []}
      >
        <ProFormGroup key="group">
          <ProFormText name="key" label="key" />
          <ProFormText name="value" label="value" />
        </ProFormGroup>
      </ProFormList>
    </ModalForm>
  );
};
export default UpdateModal;
