import { message } from 'antd';
import { fakeRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call }) {
      const response = yield call(fakeRegister, payload);
      if (response.code === 0) {
        message.success('注册成功！');
        location.href = '#/user/login';
      } else {
        message.error('注册失败！');
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
