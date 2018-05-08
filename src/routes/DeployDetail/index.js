import React, { Component } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { Button, Collapse, Table, Modal } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';

const { Description } = DescriptionList;
const { Panel } = Collapse;

const statusArr = ['待部署', '部署中', '部署失', '跳过部署', '部署完成'];

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

@connect(({ profile }) => ({
  profile,
}))
export default class AdvancedProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {},
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: `http://128.0.0.174:9001/authv1/deploy/detail?id=${this.props.match.params.id}`,
      type: 'GET',
      success: res => {
        if (res.code === 0) {
          this.setState({
            data: res.data,
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

  handleOk(){
    this.setState({
      visible: false,
    });
  }

  handleCancel(){
    this.setState({
      visible: false,
    });
  }

  showLog (log) {
    this.setState({
      log,
      visible: true,
    });
  }


  render() {

    // const { data } = this.state;

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
        key: 'status',
        title: '部署状态',
        dataIndex: 'machine_status',
        render(val){
          return <span>{statusArr[val]}</span>
        },
      },
      {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        render: (val, record) => {
          return (<span>
            <Button type="primary" onClick={() => {console.log(val)}} style={{marginRight:10}}>跳过</Button>
          </span>);
        },
      }
    ];

    // const description = (
    //   <DescriptionList className={styles.headerList} size="small" col="2">
    //     <Description term="服务名">{data.service_name}</Description>
    //     <Description term="创建者">{data.account_name}</Description>
    //     <Description term="创建时间">{data.create_date}</Description>
    //     <Description term="更新日期">{data.update_date}</Description>
    //     <Description term="描述">{data.service_describe}</Description>
    //   </DescriptionList>
    // );


    return (
      <PageHeaderLayout
        title="单号：234231029431"
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        // content={description}
      >
        <div style={{marginBottom: 20, float: 'right'}}>
          <Button type="primary"  style={{marginRight: 20}}>结束</Button>
          <Button type="primary"  >回滚</Button>
        </div>
        <div style={{clear: 'both'}} />
        <Collapse accordion>
          <Panel header={<span>哈哈哈<Button type="primary" style={{float: 'right', marginRight: 20, marginTop: -5}}>开始</Button></span>} key="1">
            <Table columns={columns} dataSource={data} pagination={false} />
          </Panel>
        </Collapse>
        <Modal
          title="日志信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>{this.state.log}</div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
