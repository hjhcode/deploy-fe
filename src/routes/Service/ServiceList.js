import React, {Fragment, PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import $ from 'jquery';
import {Badge, Card, Button, Divider, Input, Table, message} from 'antd';
import {Link, routerRedux} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ServiceList.less';
const {Search} = Input;
const status = ['停止', '运行中', '成功', '失败'];
const statusMap = ['error', 'processing', 'succeed'];

@connect(({service, loading}) => ({
  service,
  loading: loading.models.service,
}))
export default class DeployList extends PureComponent {

  constructor(props) {
    super(props);

    this.addService = this.addService.bind(this);
    this.delService = this.delService.bind(this);
    this.deployService = this.deployService.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'service/fetch',
    });
  }

  addService() {
    this.props.dispatch(routerRedux.push({
      pathname: '/service/create',
    }));
  }

  delService() {

  }

  deployService(id) {
    // this.setState({
    //   loading: true,
    // });
    $.ajax({
      url: 'http://128.0.0.174:9001/authv1/service/deploy',
      type: 'POST',
      data: {
        service_id: id,
      },
      success: (res) => {
        // this.setState({
        //   loading: false,
        // });
        if (res.code === 0) {
          message.success('部署任务创建成功');
          window.location.href = `/#/detail/deploy/${res.data}`;
        } else {
          message.error('构建失败: ' + res.msg);
        }
      },
      error: () => {
        // this.setState({
        //   loading: false,
        // });
        message.error('构建失败！');
      },
    });
  }

  render() {
    const {service: {list}, loading} = this.props;


    const extraContent = (
      <div className={styles.extraContent}>
        <Button type="primary" style={{ marginRight: 20 }} onClick={this.addService}>
          新增服务
        </Button>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入服务名"
          onSearch={() => ({})}
        />
      </div>
    );

    const data = [
      {
        id: 10,
        service_id: 999,
        service_name: '服务1号',
        service_describe: '镜像描述',
        update_date: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * 1),
        create_date: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * 2),
        deploy_statu: 0,
        account_name: 'shiyi',
      },
    ];

    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '服务名',
        dataIndex: 'service_name',
        render: (text, record) => {
          // return <a href={`/auth/service/${record.service_id}`}>{text}</a>;
          return <span>{text}</span>;
        },
      },
      {
        title: '服务描述',
        dataIndex: 'service_describe',
      },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        render: text => {
          return (
            <span>
              {moment(text).format('YYYY-MM-DD')}
              <br />
              {moment(text).format('HH:mm:ss')}
            </span>
          );
        },
      },
      {
        title: '更新时间',
        dataIndex: 'update_date',
        render: text => {
          return (
            <span>
              {moment(text).format('YYYY-MM-DD')}
              <br />
              {moment(text).format('HH:mm:ss')}
            </span>
          );
        },
      },
      {
        title: '创建人',
        dataIndex: 'account_name',
      },
      {
        title: '状态',
        dataIndex: 'service_statu',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <Link to={`/service/update/${record.id}`}>修改</Link>
            <Divider type="vertical" />
            <a onClick={() => this.deployService(record.id)} style={{cursor: 'pointer'}}>部署</a>
            <Divider type="vertical" />
            <Link to={`/detail/deploy/${record.id}`}>删除</Link>
          </Fragment>
        ),
      },
    ];

    const pagination = {
      total: data.length,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20, 50],
      defaultPageSize: 5,
      // onShowSizeChange(current, pageSize) {
      //   console.log('Current: ', current, '; PageSize: ', pageSize);
      // },
      // onChange(current) {
      //   console.log('Current: ', current);
      // },
    };

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="服务列表"
            style={{marginTop: 24}}
            bodyStyle={{padding: '0 32px 40px 32px'}}
            extra={extraContent}
          >
            <div className={styles.tableList}>
              <Table
                className={styles.tableList}
                loading={loading}
                dataSource={list}
                columns={columns}
                pagination={pagination}
              />
            </div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
