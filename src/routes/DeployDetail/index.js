import React, {Component} from 'react';
import {connect} from 'dva';
import $ from 'jquery';
import {Button, Card, Collapse, Divider, message, Spin, Table} from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';

const {Description} = DescriptionList;
const {Panel} = Collapse;

const statusArr = ['待部署', '部署中', '部署失败', '跳过部署', '部署完成'];

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i,
    id: i,
    name: 'hhhh',
    machine_status: 0,
    operation: {
      id: i,
      status: 0,
      log: 'hdugfgfr',
    },
  });
}

@connect(({profile}) => ({
  profile,
}))
export default class AdvancedProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {},
      loading: true,
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.startDeploy = this.startDeploy.bind(this);
    this.jump = this.jump.bind(this);
  }

  componentDidMount() {

    $.ajax({
      url: `http://192.168.43.98:9001/authv1/deploy/detail?id=${this.props.match.params.id}`,
      type: 'GET',
      success: res => {
        if (res.code === 0) {
          this.setState({
            data: res.data,
            loading: false,
          });
        }
      },
      error: () => {
        message.error('请求失败！');
      },
    });
    window.addEventListener('resize', this.setStepDirection);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
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

  showLog(log) {
    this.setState({
      log,
      visible: true,
    });
  }

  startDeploy(num) {
    this.setState({step: 1});
    const url = `http://192.168.43.98:9001/authv1/deploy/start`;
    $.ajax({
      url,
      type: 'POST',
      data: {deploy_id: this.props.match.params.id, group_id: num},
      success: res => {
        if (res.code === 0) {
          const timer = setInterval(() => {
            $.ajax({
              url: `http://192.168.43.98:9001/authv1/deploy/detail?id=${this.props.match.params.id}`,
              type: 'GET',
              success: function (res) {
                let data = res.data;
                if (res.code === 0) {
                  this.setState({
                    data,
                    loading: false,
                  });
                  let host_list = {};
                  if (data.host_list) {
                    host_list = JSON.parse(data.host_list);
                  }
                  // console.log(host_list);
                  if (host_list.stage) {
                    let stage = host_list.stage;
                    if (stage[num - 1].stage_status != 1) {
                      clearInterval(timer);
                    }
                  }
                }
              }.bind(this),
              error: () => {
                message.error('请求失败！');
              },
            });
          }, 500);
        }
      },
      error: () => {
        message.error('请求失败！');
      },
    });
  }

  jump(num, host) {

    $.ajax({
      url: `http://192.168.43.98:9001/authv1/deploy/jump`,
      type: 'POST',
      data: {deploy_id: this.props.match.params.id, group_id: num, host_id:host},
      success: res => {
        if (res.code === 0) {
          console.log(res);
          const timer = setInterval(() => {
            $.ajax({
              url: `http://192.168.43.98:9001/authv1/deploy/detail?id=${this.props.match.params.id}`,
              type: 'GET',
              success: function (res) {
                let data = res.data;
                if (res.code === 0) {
                  this.setState({
                    data,
                    loading: false,
                  });
                  let host_list = {};
                  if (data.host_list) {
                    host_list = JSON.parse(data.host_list);
                  }
                  // console.log(host_list);
                  if (host_list.stage) {
                    let stage = host_list.stage;
                    if (stage[num - 1].stage_status != 1) {
                      clearInterval(timer);
                    }
                  }
                }
              }.bind(this),
              error: () => {
                message.error('请求失败！');
              },
            });
          }, 500);
        }
      },
      error: () => {
        message.error('请求失败！');
      },
    });
  }

  render() {

    const {data} = this.state;
    let host_list = {};
    let stage = [];
    let m0 = [];
    let m1 = [];
    let m2 = [];
    let b0 = -1;
    let b1 = -1;
    let b2 = -1;
    if (data.host_list) {
      host_list = JSON.parse(data.host_list);
    }
    if (host_list.stage) {
      stage = host_list.stage;
      b0 = host_list.stage[0].stage_status;
      b1 = host_list.stage[1].stage_status;
      b2 = host_list.stage[2].stage_status;

      m0 = host_list.stage[0].machine;
      m1 = host_list.stage[1].machine;
      m2 = host_list.stage[2].machine;
    }


    const columns = [
      {
        key: 'id',
        title: '编号',
        dataIndex: 'id',
      },
      {
        key: 'name',
        title: '机器名',
        dataIndex: 'name',
      },
      {
        key: 'machine_status',
        title: '部署状态',
        dataIndex: 'machine_status',
        render(val) {
          return <span>{statusArr[val]}</span>
        },
      },
      // {
      //   key: 'operation',
      //   title: '操作',
      //   dataIndex: 'operation',
      //   render: (val, record, index) => {
      //     return (<span>
      //       <Button type="primary" disabled={record.machine_status != 2} onClick={() => {
      //         this.jump(host_list.stage_num, index);
      //       }} style={{marginRight: 10}}>跳过</Button>
      //     </span>);
      //   },
      // },
    ];

    const description = (
      <div>
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="创建者">{data.account_name}</Description>
          <Description term="创建时间">{data.create_date}</Description>
          <Description term="描述">{data.service_describe}</Description>
          <Description term="更新日期">{data.update_date}</Description>
        </DescriptionList>
        <div style={{marginBottom: 20, float: 'right'}}>
          <Button type="primary" disabled={data.deploy_statu != 1} style={{marginRight: 20}}>结束</Button>
          <Button type="primary" disabled={data.deploy_statu != 1} >回滚</Button>
        </div>
      </div>
    );


    return (
      <Spin spinning={this.state.loading}>
        <PageHeaderLayout
          title={data.service_name}
          logo={
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"/>
          }
          content={description}
        >

          <div style={{clear: 'both'}}/>
          <Card type="inner" title="部署流程">
            第一组
            <Button type="primary" disabled={b0 > 1} loading={b0 == 1} onClick={() => {
              this.startDeploy(1);
            }} style={{marginRight: 10, float: 'right'}}>开始</Button>
            <Divider style={{margin: '16px 0'}}/>
            <Table columns={columns} dataSource={m0} pagination={false}/>
            <Divider style={{margin: '16px 0'}}/>
            第二组
            <Button type="primary" disabled={b0 != 2 || b1 > 1} loading={b1==1} onClick={() => {
              this.startDeploy(2);
            }} style={{marginRight: 10, float: 'right'}}>开始</Button>
            <Divider style={{margin: '16px 0'}}/>
            <Table columns={columns} dataSource={m1} pagination={false}/>
            <Divider style={{margin: '16px 0'}}/>
            第三组
            <Button type="primary" disabled={b1 != 2 || b2>1} loading={b2==1} onClick={() => {
              this.startDeploy(3);
            }} style={{marginRight: 10, float: 'right'}}>开始</Button>
            <Divider style={{margin: '16px 0'}}/>
            <Table columns={columns} dataSource={m2} pagination={false}/>
          </Card>
          <Divider style={{margin: '16px 0'}}/>
          {/*<Collapse accordion>*/}
          {/*<Panel header={<span>哈哈哈<Button type="primary" style={{float: 'right', marginRight: 20, marginTop: -5}}>开始</Button></span>} key="1">*/}
          {/*<Table columns={columns} dataSource={data} pagination={false} />*/}
          {/*</Panel>*/}
          {/*</Collapse>*/}
          {/*<Modal*/}
          {/*title="日志信息"*/}
          {/*visible={this.state.visible}*/}
          {/*onOk={this.handleOk}*/}
          {/*onCancel={this.handleCancel}*/}
          {/*>*/}
          {/*<div>{this.state.log}</div>*/}
          {/*</Modal>*/}
          <Card type="inner" title="日志信息">
            <div className={styles.noData} dangerouslySetInnerHTML={{__html: data.deploy_log}} style={{color: '#000'}}/>
          </Card>
        </PageHeaderLayout>
      </Spin>
    );
  }
}
