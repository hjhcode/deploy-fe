import { addDeploy, queryDeployList } from '../services/api';

export default {
  namespace: 'deploy',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDeployList, payload);
      const list = response.data.datas;
      yield put({
        type: 'queryList',
        payload: Array.isArray(list) ? list : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(addDeploy, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
