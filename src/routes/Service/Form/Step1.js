import React, { Fragment } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Form, Input, Button, Select, message } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const {TextArea} = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

function getStage (values) {
  const stage = [{
    machine: [],
  },
    {
      machine: [],
    },
    {
      machine: [],
    },
  ];

  const { group1 } = values;
  const { group2 } = values;
  const { group3 } = values;

  for (let i = 0; i < group1.length; i += 1) {
    stage[0].machine.push({id: Number(group1[i])});
  }

  for (let i = 0; i < group2.length; i += 1) {
    stage[1].machine.push({id: Number(group2[i])});
  }

  for (let i = 0; i < group3.length; i += 1) {
    stage[2].machine.push({id: Number(group3[i])});
  }
  return {stage};

}

@Form.create()
class Step1 extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      mirrorList: [],
      hostList: [],
    };
  }

  componentDidMount() {
    $.ajax({
      url: `http://192.168.43.98:9001/authv1/mirror/show`,
      type: 'GET',
      success: res => {
        if (res.code === 0) {
          this.setState({
            mirrorList: res.data.datas,
          });

          $.ajax({
            url: `http://192.168.43.98:9001/authv1/host/show`,
            type: 'GET',
            success: response => {
              if (response.code === 0) {
                this.setState({
                  hostList: response.data.datas,
                });
              }
            },
            error: () => {
              message.error('请求失败！');
            },
          });
        }
      },
      error: () => {
        message.error('请求失败！');
      },
    });
  }
  render() {
    const { form, dispatch } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          if (values.service_member && values.service_member.length > 0) {
            values.service_member = values.service_member.join(',');
          }
          values.host_list = getStage(values)
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          dispatch(routerRedux.push('/service/create/config'));
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="服务名称">
            {getFieldDecorator('service_name', {
              // initialValue:
              rules: [{ required: true, message: '请输入服务名称' }],
            })(
              <Input placeholder="请输入服务名称" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="服务描述">
            {getFieldDecorator('service_describe', {
              rules: [{ required: true, message: '请输入服务描述' }],
            })(
              <TextArea style={{minHeight: 32}} placeholder="请输入服务描述" rows={4} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="镜像">
            {getFieldDecorator('mirror_list', {
              rules: [
                {
                  required: true,
                  message: '请输入镜像',
                },
              ],
            })(
              <Select
                placeholder="请选择镜像"
              >
                {
                  this.state.mirrorList.map( item => {
                    return <Option value={item.id} key={item.name}>{item.name}</Option>
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="服务成员">
            {getFieldDecorator('service_member')(<Select mode="tags" placeholder="输入服务成员" style={{width: '100%'}} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="第一组">
            {getFieldDecorator('group1')(<Select mode="multiple" placeholder="输入机器名称" style={{width: '100%'}}>
              {
                this.state.hostList.map( item => {
                  return <Option value={item.id.toString()} key={item.host_name}>{item.host_name}</Option>
                })
              }
            </Select>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="第二组">
            {getFieldDecorator('group2')(<Select mode="multiple" placeholder="输入机器名称" style={{width: '100%'}}>
              {
                this.state.hostList.map( item => {
                  return <Option value={item.id.toString()} key={item.host_name}>{item.host_name}</Option>
                })
              }
            </Select>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="第三组">
            {getFieldDecorator('group3')(<Select mode="multiple" placeholder="输入机器名称" style={{width: '100%'}}>
              {
                this.state.hostList.map( item => {
                  return <Option value={item.id.toString()} key={item.host_name}>{item.host_name}</Option>
                })
              }
            </Select>)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step1);
