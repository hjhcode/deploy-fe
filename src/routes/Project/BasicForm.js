import React, {PureComponent} from 'react';
import {Button, Form, Input, message, Select} from 'antd';
import $ from 'jquery';
import error from '../../models/error';

const FormItem = Form.Item;
const {TextArea} = Input;

@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (Array.isArray(values.project_member)) {
        values.project_member = values.project_member.join(','); // 将构建者用逗号连接
      }
      const {type} = this.props;
      if (type === 'add') {
        this.addProject(values);
      } else if (type === 'update') {
        this.updateProject(values);
      }
    });
  };

  addProject(values) {
    $.ajax({
      url: 'http://192.168.43.98:9001/authv1/project/add',
      type: 'POST',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: values,
      success: res => {
        if (res.code === 0) {
          this.props.closeModal();
          this.props.form.resetFields();

          message.success('添加成功！');
          this.props.loadProjectList();
        } else {
          message.error(`添加失败！${  res.msg}`);
        }
      },
      error: () => {
        this.props.closeModal();
        message.error('添加失败！');
      },
    });
  }

  updateProject(values) {
    values.project_id = this.props.project.id;
    // values.project_member =this.props.project_member;
    $.ajax({
      url: 'http://192.168.43.98:9001/authv1/project/update',
      type: 'POST',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: values,
      success: (res) => {
        if (res.code === 0) {
          this.props.closeModal();
          message.success('修改成功！');
          this.props.loadProjectList();
        } else {
          message.error(`修改失败！${  res.msg}`);
        }
      },
      error() {
        console.log(error);
        // this.props.closeModal();
        message.error('修改失败！');
      },
    });
  }

  render() {
    const {submitting, project, loadProjectList} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
      },
    };

    return (
      <Form
        id="addProject"
        onSubmit={this.handleSubmit}
        hideRequiredMark
        style={{marginTop: 8, width: '100%'}}
      >
        <FormItem {...formItemLayout} label="项目名称">
          {getFieldDecorator('project_name', {
            initialValue: project.project_name,
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(<Input placeholder="输入项目名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="项目描述">
          {getFieldDecorator('project_describe', {
            initialValue: project.project_describe,
            rules: [
              {
                required: true,
                message: '请输入项目描述',
              },
            ],
          })(<TextArea style={{minHeight: 32}} placeholder="请输入项目描述" rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="构建路径">
          {getFieldDecorator('git_docker_path', {
            initialValue: project.git_docker_path,
            rules: [
              {
                required: true,
                message: '请输入构建路径',
              },
            ],
          })(<Input placeholder="输入构建路径" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="构建者">
          {getFieldDecorator('project_member', {
            initialValue: project.project_member,
            // initialValue : type ==="add" ? project.account_id : project.project_member.split(","),
            rules: [
              {
                required: true,
                message: '请输入构建者',
              },
            ],
          })(<Select mode="tags" placeholder="输入构建者" style={{width: '100%'}} />)}
        </FormItem>
        <FormItem {...submitFormLayout} style={{marginTop: 32}}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            onClick={this.props.addProject}
          >
            提交
          </Button>
          <Button style={{marginLeft: 8}} onClick={this.props.closeModal}>
            取消
          </Button>
        </FormItem>
      </Form>
    );
  }
}
