import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, message } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';
import $ from 'jquery';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/service/create/info'));
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          const docker = {
            workdir: values.workdir,
            hostname: values.hostname,
            hostlist: values.hostlist,
            dns: values.dns,
            env: values.env,
            cmd: values.cmd,
            volume: values.volume,
            expose: values.expose,
          };

          const reqdata = {
            service_name: data.service_name,
            service_describe: data.service_describe,
            host_list: JSON.stringify(data.host_list),
            mirror_list: data.mirror_list,
            docker_config: JSON.stringify(docker),
            service_member: data.service_member,
          };
          $.ajax({
            url: `http://192.168.43.98:9001/authv1/service/add`,
            type: 'POST',
            data: reqdata,
            success: res => {
              if (res.code === 0) {
                dispatch(routerRedux.push('/service/create/host'));
              } else {
                message.error('提交失败！');
              }
            },
            error: () => {
              message.error('请求失败！');
            },
          });
        }
      });
    };
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label="workdir">
          {getFieldDecorator('workdir', {
            rules: [{ required: true,message: '请输入workdir' }],
          })(
            <Input placeholder="请输入workdir" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="hostname">
          {getFieldDecorator('hostname', {
            rules: [{ required: true,message: '请输入hostname' }],
          })(
            <Input placeholder="请输入hostname" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="hostlist">
          {getFieldDecorator('hostlist', {
            rules: [
              {
                required: true,
                message: '请输入hostlist',
              },
            ],
          })(<Select mode="tags" placeholder="输入hostlist" style={{width: '100%'}} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="env">
          {getFieldDecorator('env', {
            rules: [
              {
                required: true,
                message: '请输入env',
              },
            ],
          })(<Select mode="tags" placeholder="输入env" style={{width: '100%'}} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="dns">
          {getFieldDecorator('dns', {
            rules: [
              {
                required: true,
                message: '请输入dns',
              },
            ],
          })(<Select mode="tags" placeholder="输入dns" style={{width: '100%'}} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="cmd">
          {getFieldDecorator('cmd', {
            rules: [{ required: true,message: '请输入cmd' }],
          })(
            <Input placeholder="请输入cmd" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="volume">
          {getFieldDecorator('volume', {
            rules: [
              {
                required: true,
                message: '请输入volume',
              },
            ],
          })(<Select mode="tags" placeholder="输入volume" style={{width: '100%'}} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="expose">
          {getFieldDecorator('expose', {
            rules: [
              {
                required: true,
                message: '请输入expose',
              },
            ],
          })(<Select mode="tags" placeholder="输入expose" style={{width: '100%'}} />)}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step2);
