import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Button, Steps, Card, Popover, Badge } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';

const { Step } = Steps;
const { Description } = DescriptionList;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

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

const popoverContent = (
  <div style={{ width: 160 }}>
    吴加号
    <span className={styles.textSecondary} style={{ float: 'right' }}>
      <Badge status="default" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{ marginTop: 4 }}>
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
    dot
  );

@connect(({ profile }) => ({
  profile,
}))
export default class AdvancedProfile extends Component {
  state = {
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection);
  }
  // componentDidMount() {
  //   $.ajax({
  //     url: `http://128.0.0.174:9001/authv1/construct/show`,
  //     type: 'GET',
  //     success: res => {
  //       if (res.code === 0) {
  //         this.setState({
  //           data: res.data.datas,
  //         });
  //       }
  //     },
  //     error: () => {
  //       message.error('请求失败！');
  //     },
  //   });
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  renderButton(num) {
    if (num === 0) {
      return (
        <Button type="primary" icon="poweroff" onClick={this.startBuild}>
          开始构建
        </Button>
      );
    } else if (num === 1) {
      return (
        <Button type="primary" loading>
          正在构建
        </Button>
      );
    } else {
      return '';
    }
  }

  render() {
    const { stepDirection } = this.state;

    return (
      <PageHeaderLayout
        title="工程1"
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        content={description}
      >
        <Card title="构建进度" style={{ marginBottom: 24 }} bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Steps
              direction={stepDirection}
              progressDot={customDot}
              current={0}
              style={{ width: '88%' }}
            >
              <Step title="未构建" />
              <Step title="构建中" />
              <Step title="完成" />
            </Steps>
            <div style={{ width: '10%' }}>{this.renderButton(0)}</div>
          </div>
        </Card>
        <Card title="日志信息" style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.noData} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
