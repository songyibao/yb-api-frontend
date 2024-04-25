// 判断 res.code 是否为 0，如果是，则返回 true ,否则返回 false
export const validRes = (res: any) => res.code === 0;
