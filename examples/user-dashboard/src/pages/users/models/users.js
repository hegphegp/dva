import * as usersService from '../services/users';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
  },
  effects: {
    *fetch({ payload: { page = 1 } }, { call, put }) {
      console.log("再先执行");
      const { data, headers } = yield call(usersService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data: data.list,
          total: data.total,
          page: data.page,
        },
      });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(usersService.remove, id);
      yield put({ type: 'reload' });
    },
    *patch({ payload: { id, values } }, { call, put }) {
      yield call(usersService.patch, id, values);
      yield put({ type: 'reload' });
    },
    *create({ payload: values }, { call, put }) {
      yield call(usersService.create, values);
      yield put({ type: 'reload' });
    },
    *reload(action, { put, select }) {
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      console.log("先执行");
      // pathname和query参数在哪里声明了，还是可以直接用的
      return history.listen(({ pathname, query }) => {
        if (pathname === '/users') {
          console.log("\n\n\n查询参数"+JSON.stringify(query)+"\n\n\n\n");
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
