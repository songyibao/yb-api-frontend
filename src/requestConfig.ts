import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
export interface ResponseStructure {
  success: boolean;
  data: any;
  code?: number;
  message?: string;
  // showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: 'http://localhost:8101',
  withCredentials: true,
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      console.log('错误抛出', res);
      if (!res.success) {
        // const error: any = new Error(res.message);
        // error.name = 'YbApiError';
        // error.info = res;
        message.error(res.message);
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      console.log('错误处理', error, opts);
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      // if (error.name === 'YbApiError') {
      //   message.error(error.info.errorMessage);
      // } else
      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`响应状态码:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('未响应，请重试');
      } else {
        // 发送请求时出了点问题
        message.error('未知错误，请重试');
      }
    },
  },

  // 请求拦截器
  // requestInterceptors: [
  //   (config: RequestOptions) => {
  //     // 拦截请求配置，进行个性化处理。
  //     const url = config?.url?.concat('?token = 123');
  //     return { ...config, url };
  //   },
  // ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      console.log('响应拦截器', response);
      // // 拦截响应数据，进行个性化处理
      // const responseData = response.data as { code: number; message: string; data: any };
      // const { code: errorCode, message: errorMessage, data } = responseData;
      // // @ts-ignore
      // response.data = {
      //   errorCode,
      //   errorMessage,
      //   data,
      //   success: errorCode === 0,
      // };
      return response;
    },
  ],
  // `validateStatus` 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，
  // 则promise 将会 resolved，否则是 rejected。
  // validateStatus: function (status) {
  //   return true; // 默认值
  // },
};
