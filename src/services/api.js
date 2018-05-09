import { stringify } from 'qs';
import request from '../utils/request';

const endpoint = 'http://xupt3.fightcoder.com:9002';

export async function queryDeployList() {
  return request(`${endpoint}/authv1/deploy/show`);
}

export async function addDeploy() {
  return request(`${endpoint}/authv1/deploy/add`);
}

export async function queryServiceList() {
  return request(`${endpoint}/authv1/service/show`);
}

export async function queryServiceListByName(params) {
  return request(`${endpoint}/authv1/service/search?${stringify(params)}`);
}

export async function addService() {
  return request(`${endpoint}/authv1/service/add`);
}



// -----------

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request(`${endpoint}/apiv1/login`, {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request(`${endpoint}/apiv1/register`, {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
