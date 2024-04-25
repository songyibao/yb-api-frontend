import { Footer } from '@/components';
import { userRegisterUsingPost } from '@/services/ybapi-backend/userController';
import { history } from '@@/core/history';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';

const Register: React.FC = () => {
  const handleSubmit = async (values: API.UserRegisterRequest) => {
    // 注册
    const res = await userRegisterUsingPost({
      ...values,
    });
    console.log('注册信息', res);
    if (res.data) {
      // 跳转到登陆页面
      message.success('注册成功！');
      history.push('/user/login');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
        backgroundImage:
          "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
        backgroundSize: '100% 100%',
      }}
    >
      <div
        style={{
          flex: 1,
          padding: '32px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '44px',
            lineHeight: '44px',
          }}
        >
          <div style={{ fontWeight: '600', fontSize: '33px' }}>API 开放平台</div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '44px',
            lineHeight: '44px',
          }}
        >
          <div style={{ fontWeight: '400', fontSize: '16px' }}>新用户注册</div>
        </div>
        <ProForm
          title="Ant Design"
          onFinish={handleSubmit}
          submitter={{
            searchConfig: { submitText: '注册', resetText: '重置' },
            resetButtonProps: { style: { width: '100px' } },
            submitButtonProps: { style: { width: '100px', marginLeft: 'auto' } },
          }}
        >
          <>
            <ProFormText
              name="userAccount"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={'至少4位用户名'}
              rules={[{ required: true, message: '请输入用户名!' }]}
            />
            <ProFormText.Password
              name="userPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={'至少8位密码，区分大小写'}
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            />
            <ProFormText.Password
              name="checkPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={'确认密码'}
              dependencies={['userPassword']}
              rules={[
                {
                  required: true,
                  message: '请确认密码!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('userPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不匹配!'));
                  },
                }),
              ]}
            />
          </>
          <div>
            <ProFormCheckbox noStyle name="agreement">
              我已阅读并同意<a>《服务协议》</a>与<a>《隐私政策》</a>
            </ProFormCheckbox>
          </div>
          <div
            style={{
              marginTop: 24,
            }}
          ></div>
        </ProForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
