import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Collapse, Table, Modal } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';

const { Description } = DescriptionList;
const { Panel } = Collapse;

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i,
    id: i,
    name: 'hhhh',
    time: '2018-02-09 23:22:34',
    operation: {
      id: i,
      status: 0,
      log: 'hdugfgfr',
    },
  });
}


const description = (
  <DescriptionList className={styles.headerList} size="small" col="2">
    <Description term="创建人">曲丽丽</Description>
    <Description term="订购产品">XX 服务</Description>
    <Description term="创建时间">2017-07-07</Description>
    <Description term="关联单据">
      <a href="">12421</a>
    </Description>
    <Description term="生效日期">2017-07-07 ~ 2017-08-08</Description>
    <Description term="备注">请于两个工作日内确认</Description>
  </DescriptionList>
);

@connect(({ profile }) => ({
  profile,
}))
export default class AdvancedProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentDidMount() {
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
        key: 'endUpdateTime',
        title: '最后更新时间',
        dataIndex: 'time',
      },
      {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        render: (val, record) => {
          return (<span>
            <Button type="primary" onClick={() => {console.log(val)}} style={{marginRight:10}}>跳过</Button>
            <Button type="default" onClick={() => {this.showLog(record.operation.log)}}>详情</Button>
          </span>);
        },
      }
    ];


    return (
      <PageHeaderLayout
        title="单号：234231029431"
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        content={description}
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
