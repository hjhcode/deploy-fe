import React, { Fragment } from 'react';
import $ from 'jquery';
import { Form, Input, Button, Select, message, Card } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Form/style.less';

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


@Form.create()
export default class UpdateService extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      service: {},
      hostList: [],
      mirrorList: [],
    };
  }

  componentDidMount() {
    $.ajax({
      url: `http://192.168.43.98:9001/authv1/mirror/show`,
      type: 'GET',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: res => {
        if (res.code === 0) {
          this.setState({
            mirrorList: res.data.datas,
          });

          $.ajax({
            url: `http://192.168.43.98:9001/authv1/host/show`,
            type: 'GET',
            xhrFields: {
              withCredentials: true,
            },
            crossDomain: true,
            success: response => {
              if (response.code === 0) {
                this.setState({
                  hostList: response.data.datas,
                });

                $.ajax({
                  url: `http://192.168.43.98:9001/authv1/service/detail?id=${this.props.match.params.id}`,
                  type: 'GET',
                  xhrFields: {
                    withCredentials: true,
                  },
                  crossDomain: true,
                  success: resp => {
                    if (resp.code === 0) {
                      this.setState({
                        service: resp.data,
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
      },
      error: () => {
        message.error('请求失败！');
      },
    });
  }

  getmirrorListId(str) {
    // console.log(str);
    const { mirrorList } = this.state;
    // console.log(mirrorList);
    for (let i = 0; i < mirrorList.length; i++) {
      if (mirrorList[i].name === str) {
        console.log(mirrorList[i].id);
        return mirrorList[i].id;
      }
    }
    return str;
  }

  getStage (values) {
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
    const { hostList } = this.state;
    for (let i = 0; i < group1.length; i += 1) {
      for (let j = 0; j < hostList.length; j++) {
        if (group1[i] === hostList[j].host_name) {
          group1[i] = hostList[j].id;
        }
      }
      stage[0].machine.push({id: Number(group1[i])});
    }

    for (let i = 0; i < group2.length; i += 1) {
      for (let j = 0; j < hostList.length; j++) {
        if (group2[i] === hostList[j].host_name) {
          group2[i] = hostList[j].id;
        }
      }
      stage[1].machine.push({id: Number(group2[i])});
    }

    for (let i = 0; i < group3.length; i += 1) {
      for (let j = 0; j < hostList.length; j++) {
        if (group3[i] === hostList[j].host_name) {
          group3[i] = hostList[j].id;
        }
      }
      stage[2].machine.push({id: Number(group3[i])});
    }
    return {stage};

  }

  getHostListName(list) {
    // console.log(list);
    const names = [];
    for (let i = 0; i < list.length; i+=1) {
      names.push(list[i].name);
    }
    return names;
  }

  render() {
    const { form, dispatch } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { service } = this.state;
    let host_list = { stage: []};
    let docker_config = {};
    if (service.host_list) {
      // console.log(host_list);
      // console.log(JSON.parse(host_list));
      host_list = JSON.parse(service.host_list);
      docker_config = JSON.parse(service.docker_config);
    }
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          // console.log(values);
          if (values.service_member && values.service_member.length > 0) {
            values.service_member = values.service_member.join(',');
          }
          values.host_list = this.getStage(values);
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
            service_id: this.props.match.params.id,
            service_name: values.service_name,
            service_describe: values.service_describe,
            host_list: JSON.stringify(this.getStage(values)),
            mirror_list: this.getmirrorListId(values.mirror_list),
            docker_config: JSON.stringify(docker),
            service_member: values.service_member,
          };
          $.ajax({
            url: `http://192.168.43.98:9001/authv1/service/update`,
            type: 'POST',
            xhrFields: {
              withCredentials: true,
            },
            crossDomain: true,
            data: reqdata,
            success: resp => {
              if (resp.code === 0) {
                message.success('修改成功！');
                location.href = '/#/service/list';
              } else {
                message.error(resp.msg);
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
      <Card bordered={false} title="修改服务">
        <Fragment>
          <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
              <Form.Item {...formItemLayout} label="服务名称">
                {getFieldDecorator('service_name', {
                  initialValue: service.service_name,
                  rules: [{ required: true, message: '请输入服务名称' }],
                })(
                  <Input placeholder="请输入服务名称" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="服务描述">
                {getFieldDecorator('service_describe', {
                  initialValue: service.service_describe,
                  rules: [{ required: true, message: '请输入服务描述' }],
                })(
                  <TextArea style={{minHeight: 32}} placeholder="请输入服务描述" rows={4} />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="镜像">
                {getFieldDecorator('mirror_list', {
                  initialValue: service.mirror_list,
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
                {getFieldDecorator('service_member', {
                  initialValue: service.service_member ? service.service_member.split(',') : [],
                })(<Select mode="tags" placeholder="输入服务成员" style={{width: '100%'}} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="第一组">
                {getFieldDecorator('group1', {
                  initialValue: (host_list && host_list.stage[0]) ?
                    this.getHostListName(host_list.stage[0].machine) : [],
                })(<Select mode="multiple" placeholder="输入机器名称" style={{width: '100%'}}>
                  {
                    this.state.hostList.map( item => {
                      return <Option value={item.id.toString()} key={item.host_name}>{item.host_name}</Option>
                    })
                  }
                </Select>)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="第二组">
                {getFieldDecorator('group2', {
                  initialValue: (host_list && host_list.stage[1]) ?
                    this.getHostListName(host_list.stage[1].machine) : [],
                })(<Select mode="multiple" placeholder="输入机器名称" style={{width: '100%'}}>
                  {
                    this.state.hostList.map( item => {
                      return <Option value={item.id.toString()} key={item.host_name}>{item.host_name}</Option>
                    })
                  }
                </Select>)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="第三组">
                {getFieldDecorator('group3', {
                  initialValue: (host_list && host_list.stage[2]) ?
                    this.getHostListName(host_list.stage[2].machine) : [],
                })(<Select mode="multiple" placeholder="输入机器名称" style={{width: '100%'}}>
                  {
                    this.state.hostList.map( item => {
                      return <Option value={item.id.toString()} key={item.host_name}>{item.host_name}</Option>
                    })
                  }
                </Select>)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="workdir">
                {getFieldDecorator('workdir', {
                  initialValue: docker_config ? docker_config.workdir : '',
                  // rules: [{ required: true,message: '请输入workdir' }],
                })(
                  <Input placeholder="请输入workdir" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="hostname">
                {getFieldDecorator('hostname', {
                  initialValue: docker_config ? docker_config.hostname : '',
                  // rules: [{ required: true,message: '请输入hostname' }],
                })(
                  <Input placeholder="请输入hostname" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="hostlist">
                {getFieldDecorator('hostlist', {
                  initialValue: docker_config ? docker_config.hostlist : [],
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请输入hostlist',
                  //   },
                  // ],
                })(<Select mode="tags" placeholder="输入hostlist" style={{width: '100%'}} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="env">
                {getFieldDecorator('env', {
                  initialValue: docker_config ? docker_config.env : [],
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请输入env',
                  //   },
                  // ],
                })(<Select mode="tags" placeholder="输入env" style={{width: '100%'}} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="dns">
                {getFieldDecorator('dns', {
                  initialValue: docker_config ? docker_config.dns : [],
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请输入dns',
                  //   },
                  // ],
                })(<Select mode="tags" placeholder="输入dns" style={{width: '100%'}} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="cmd">
                {getFieldDecorator('cmd', {
                  initialValue: docker_config ? docker_config.cmd : '',
                  // rules: [{ required: true,message: '请输入cmd' }],
                })(
                  <Input placeholder="请输入cmd" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="volume">
                {getFieldDecorator('volume', {
                  initialValue: docker_config ? docker_config.volume : [],
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请输入volume',
                  //   },
                  // ],
                })(<Select mode="tags" placeholder="输入volume" style={{width: '100%'}} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="expose">
                {getFieldDecorator('expose', {
                  initialValue: docker_config ? docker_config.expose : [],
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请输入expose',
                  //   },
                  // ],
                })(<Select mode="tags" placeholder="输入expose" style={{width: '100%'}} />)}
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  xs: { span: 24, offset: 0 },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              >
                <Button type="primary" onClick={onValidateForm}>提交</Button>
              </Form.Item>
          </Form>
        </Fragment>
      </Card>);
  }
}

