import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import $ from 'jquery';
import { Link } from 'dva/router';
import { Table, Badge, Card, message } from 'antd';
import moment from 'moment/moment';
import styles from './index.less';


const statusMap = ['processing', 'success', 'error'];
const status = ['进行中', '成功', '失败'];

const data  = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    id: i+ 1,
    account_id: 'www@qq.com',
    constructor_start: moment().subtract(i, 'days').startOf('day').format('YYYY-MM-DD HH:mm:SS'),
    constructor_end: moment().subtract(i, 'days').startOf('day').format('YYYY-MM-DD HH:mm:SS'),
    constructor_statu: Math.round(Math.random() * 2),
    mirror_id: i + 1,
    project_id: i + 1,
  });
}


class StandardTable extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
    };
  }

  componentDidMount() {
    const params = {
      page: 1,
      size: 10,
    };
    $.ajax({
      url:`http://128.0.0.175:9001/authv1/construct/show?${stringify(params)}`,
      method: 'GET',
      success: function (res) {
        if (res.code === 0) {
          this.setState({
            data: res.data.datas,
          });
        }
      },
      error: function () {
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
        key: 'account_id',
        title: '构建者',
        dataIndex: 'account_id',
      },
      {
        key: 'constructor_start',
        title: '开始时间',
        dataIndex: 'constructor_start',
      },
      {
        key: 'constructor_end',
        title: '结束时间',
        dataIndex: 'constructor_end',
      },
      {
        key: 'constructor_statu',
        title: '构建状态',
        dataIndex: 'constructor_statu',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        key: 'detail',
        title: '详情',
        dataIndex: 'id',
        render(val) {
          return <Link to={`/detail/build/${val}`}>详情</Link>
        },
      },
    ];

    const { loading } = this.state;

    return (
      <Card border="false">
        <div className={styles.tableList}>
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
          />
        </div>
      </Card>
    );
  }
}

export default StandardTable;
