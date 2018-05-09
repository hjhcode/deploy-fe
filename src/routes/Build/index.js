import React, { PureComponent } from 'react';
import $ from 'jquery';
import { Link } from 'dva/router';
import { Badge, Card, message, Table } from 'antd';
import moment from 'moment/moment';
import styles from './index.less';

const statusMap = ['processing', 'processing', 'success', 'error'];
const status = ['待开始', '进行中', '成功', '失败'];

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    id: i + 1,
    account_id: 'www@qq.com',
    constructor_start: moment()
      .subtract(i, 'days')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:SS'),
    constructor_end: moment()
      .subtract(i, 'days')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:SS'),
    constructor_statu: Math.round(Math.random() * 2),
    mirror_id: i + 1,
    project_id: i + 1,
  });
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
    };
  }

  componentDidMount() {
    $.ajax({
      url: `http://xupt3.fightcoder.com:9002/authv1/construct/show`,
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

  render() {
    const columns = [
      {
        key: 'id',
        title: '编号',
        dataIndex: 'id',
      },
      {
        key: 'project_name',
        title: '工程名',
        dataIndex: 'project_name',
      },
      {
        key: 'mirror_name',
        title: '镜像名',
        dataIndex: 'mirror_name',
      },
      {
        key: 'account_name',
        title: '构建者',
        dataIndex: 'account_name',
      },
      {
        key: 'constructor_start',
        title: '开始时间',
        dataIndex: 'construct_start',
      },
      {
        key: 'construct_end',
        title: '结束时间',
        dataIndex: 'construct_end',
      },
      {
        key: 'construct_statu',
        title: '构建状态',
        dataIndex: 'construct_statu',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        key: 'detail',
        title: '详情',
        dataIndex: 'id',
        render(val) {
          return <Link to={`/detail/build/${val}`}>详情</Link>;
        },
      },
    ];

    const { loading } = this.state;

    return (
      <Card border="false">
        <div className={styles.tableList}>
          <Table loading={loading} dataSource={this.state.data} columns={columns} />
        </div>
      </Card>
    );
  }
}

export default StandardTable;
