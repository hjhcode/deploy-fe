import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import { stringify } from 'qs';
import { Button, Card, Col, Divider, Input, message, Modal, Popconfirm, Row, Table } from 'antd';
import BasicForm from './BasicForm';

const { Search } = Input;

// function subscription(state) {
//   const type = state > 80 ? 'success' : state < 30 ? 'error' : 'info';
//   const msg = state > 80 ? '成功' : state < 30 ? '失败' : '成功，应用运行中';
//   message[type](`订阅报警${msg}`);
// }

const data = [];
for (let i = 1; i <= 36; i += 1) {
  data.push({
    key: i,
    project_name: `工程${i}`,
    project_describe: '这是工程描述',
    account_id: 'hahahha',
    create_date: moment()
      .subtract(i, 'days')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:SS'),
    update_date: moment()
      .subtract(i, 'days')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:SS'),
    git_docker_path: 'path/project',
    id: i,
  });
}

class CusTableDemo extends React.Component {
  s;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      bordered: false,
      size: 'default',
      titleName: '添加工程',
      showHeader: true,
      visible: false,
      project: {},
      type: 'add',
      data: [],
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.addProject = this.addProject.bind(this);
    this.delProject = this.delProject.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.loadProjectList = this.loadProjectList.bind(this);
  }

  componentDidMount() {
    this.loadProjectList();
  }

  loadProjectList() {
    $.ajax({
      // url:`http://xupt3.fightcoder.com:9002/authv1/project/show?${stringify(params)}`,
      url: `http://xupt3.fightcoder.com:9002/authv1/project/show`,
      type: 'GET',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: res => {
        if (res.code === 0) {
          this.setState({
            loading: false,
            data: res.data.datas,
          });
        }
      },
      error: () => {
        message.error('请求失败！');
      },
    });
  }

  handleOk() {
    this.setState({
      visible: false,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  addProject() {
    this.setState({
      visible: true,
      type: 'add',
      project: {},
      titleName: '添加工程',
    });
  }

  delProject(id) {
    $.ajax({
      url: 'http://xupt3.fightcoder.com:9002/authv1/project/del',
      type: 'POST',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: {
        project_id: id,
      },
      dataType: 'json',
      success: res => {
        if (res.code === 0) {
          message.success('删除成功！');
          this.loadProjectList();
        } else {
          message.error(res.msg);
        }
      },
      error: () => {
        message.error('删除失败！');
      },
    });
  }

  buildProject(id) {
    this.setState({
      loading: true,
    });
    $.ajax({
      url: 'http://xupt3.fightcoder.com:9002/authv1/project/construct',
      type: 'POST',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      data: {
        project_id: id,
      },
      success: res => {
        this.setState({
          loading: false,
        });
        if (res.code === 0) {
          message.success('构建任务创建成功');
          window.location.href = `http://localhost:8000/#/detail/build/${res.data}`;
        } else {
          message.success('构建失败: ' + res.msg);
        }
      },
      error: () => {
        this.setState({
          loading: false,
        });
        message.error('构建失败！');
      },
    });
  }

  searchProject(value) {
    const params = {
      name: value,
    };
    $.ajax({
      url: `http://xupt3.fightcoder.com:9002/authv1/project/search?${stringify(params)}`,
      type: 'GET',
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: function(res) {
        if (res.code === 0) {
          this.setState({
            data: res.data.datas,
          });
        } else {
          message.error('工程不存在');
          this.setState({
            data: [],
          });
        }
      }.bind(this),
      error: function() {
        message.error('请求发送失败！');
        this.setState({
          data: [],
        });
      }.bind(this),
    });
  }

  closeModal() {
    this.setState({
      visible: false,
    });
  }

  render() {
    // const { global } = this.props;
    // const { siderRespons } = global;
    // const extenProps = true ? Object.assign(this.state, { scroll: { x: 1300 } }) : this.state;
    const columns = [
      {
        title: '工程名',
        dataIndex: 'project_name',
        key: 'project_name',
      },
      {
        title: '工程描述',
        dataIndex: 'project_describe',
        key: 'project_describe',
      },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        key: 'create_date',
      },
      {
        title: '更新时间',
        dataIndex: 'update_date',
        key: 'update_date',
      },
      {
        title: '创建者',
        dataIndex: 'account_id',
        key: 'account_id',
      },
      {
        title: 'Dockerfile',
        dataIndex: 'git_docker_path',
        key: 'git_docker_path',
        render: text => <a href={text}>{text}</a>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'action',
        render: (id, record) => (
          <span>
            <a
              onClick={() => {
                this.setState({
                  project: record,
                  type: 'update',
                  visible: true,
                  titleName: '修改工程',
                });
              }}
            >
              修改
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.buildProject(id)}>构建</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="left"
              title={`您确认删除 ${record.project_name} 项目`}
              okText="是"
              cancelText="否"
              onConfirm={() => {
                this.delProject(id);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    const { visible, titleName, project, type, loading } = this.state;
    return (
      <div>
        <Card hoverable>
          <div>
            <Row>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <h2>工程列表</h2>
              </Col>
              <Col xs={24} sm={24} md={12} lg={16} xl={16} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginRight: 20 }} onClick={this.addProject}>
                  新增项目
                </Button>
                <Search
                  placeholder="输入工程名进行搜索"
                  style={{ width: 200 }}
                  onSearch={value => this.searchProject(value)}
                />
              </Col>
            </Row>
          </div>
          <Table {...this.state} columns={columns} dataSource={this.state.data} loading={loading} />
        </Card>
        <Modal
          title={titleName}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <BasicForm
            project={project}
            type={type}
            loadProjectList={this.loadProjectList}
            closeModal={this.closeModal}
          />
        </Modal>
      </div>
    );
  }
}

// CusTableDemo.propTypes = {
//   global: PropTypes.object,
// }

// export default connect(({ global }) => ({ global }))(CusTableDemo);
export default CusTableDemo;
