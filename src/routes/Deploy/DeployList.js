import React, { Fragment, PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, Progress, Radio, Table } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DeployList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ deploy, loading }) => ({
  deploy,
  loading: loading.models.deploy,
}))
export default class DeployList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'deploy/fetch',
    });
  }

  render() {
    const { deploy: { list }, loading } = this.props;

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup>
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
        mirror_describe: '镜像描述',
        deploy_start: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * 1),
        deploy_end: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * 2),
        deploy_statu: 0,
        percent: Math.ceil(Math.random() * 50) + 50,
        account_name: 'shiyi',
      },
    ];

    const columns = [
      {
        title: '任务编号',
        dataIndex: 'id',
      },
      {
        title: '服务名',
        dataIndex: 'service_name',
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: '镜像描述',
        dataIndex: 'mirror_describe',
      },
      {
        title: '创建时间',
        dataIndex: 'deploy_start',
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
        title: '最后操作时间',
        dataIndex: 'deploy_end',
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
        title: '操作人',
        dataIndex: 'account_name',
      },
      {
        title: '任务进度',
        dataIndex: 'deploy_statu',
        render: (text, record) => {
          return (
            <div className={styles.listContentItem}>
              <Progress
                percent={record.percent}
                status={['active', 'exception', 'normal'][text]}
                strokeWidth={6}
                style={{ width: 180 }}
              />
            </div>
          );
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <Link to={`/detail/deploy/${record.id}`}>详情</Link>
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
            title="部署任务列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
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
