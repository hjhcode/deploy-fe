import React, { PureComponent } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import $ from 'jquery';

const FormItem = Form.Item;
const { TextArea } = Input;

let closeMask;
let loadList;

@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.project_member = values.project_member.join(',');
      const { type } = this.props;
      if (type === 'add') {
        this.addProject(values);
      } else if (type === 'update') {
        this.updateProject(values);
      }
    });
  };

  addProject(values) {
    $.ajax({
      url: '/authv1/project/add',
      mathod: 'POST',
      body: values,
      success: function(res) {
        if (res.code === 0) {
          closeMask();
          message.success('添加成功！');
          loadList();
        }
      },
      error: function() {
        closeMask();
        message.error('添加失败！');
      },
    });
  }

  updateProject(values) {
    values.problem_id = this.props.project.id;
    $.ajax({
      url: '/authv1/project/update',
      mathod: 'POST',
      body: values,
      success: function(res) {
        if (res.code === 0) {
          closeMask();
          message.success('修改成功！');
          loadList();
        }
      },
      error: function() {
        closeMask();
        message.error('修改失败！');
      },
    });
  }
  render() {
    const { submitting, project, closeModal, loadProjectList } = this.props;
    const { getFieldDecorator } = this.props.form;
    closeMask = closeModal;
    loadList = loadProjectList;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8, width: '100%' }}>
        <FormItem {...formItemLayout} label="服务名称">
          {getFieldDecorator('project_name', {
            initialValue: project.project_name,
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(<Input placeholder="输入服务名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="服务描述">
          {getFieldDecorator('project_describe', {
            initialValue: project.project_describe,
            rules: [
              {
                required: true,
                message: '请输入服务描述',
              },
            ],
          })(<TextArea style={{ minHeight: 32 }} placeholder="请输入服务描述" rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="镜像名">
          {getFieldDecorator('git_docker_path', {
            initialValue: project.git_docker_path,
            rules: [
              {
                required: true,
                message: '请输入镜像名',
              },
            ],
          })(<Input placeholder="输入镜像名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="服务成员">
          {getFieldDecorator('project_member', {
            initialValue: project.account_id,
            rules: [
              {
                required: true,
                message: '请输入服务成员',
              },
            ],
          })(<Select mode="tags" placeholder="输入服务成员" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.props.closeModal}>
            取消
          </Button>
        </FormItem>
      </Form>
    );
  }
}
