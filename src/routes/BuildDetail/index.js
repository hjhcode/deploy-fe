import React, {Component} from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import {connect} from 'dva';
import {Badge, Button, Card, Popover, message, Steps} from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';
import $ from "jquery";

const {Step} = Steps;
const {Description} = DescriptionList;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const popoverContent = (
  <div style={{width: 160}}>
    吴加号
    <span className={styles.textSecondary} style={{float: 'right'}}>
      <Badge status="default" text={<span style={{color: 'rgba(0, 0, 0, 0.45)'}}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{marginTop: 4}}>
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, {status}) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
    dot
  );

@connect(({profile}) => ({
  profile,
}))
export default class AdvancedProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      stepDirection: 'horizontal',
    };

    this.startBuild = this.startBuild.bind(this);
  }

  componentDidMount() {
    const {location} = this.props;
    const {pathname} = location;
    const pathList = pathname.split('/');
    const id = pathList[pathList.length - 1];
    const url = `http://192.168.43.98:9001/authv1/construct/detail?id=${ id}`;
    $.ajax({
      url,
      type: 'GET',
      success: res => {
        if (res.code === 0) {
          this.setState({
            loading: false,
            data: res.data,
            step: 0,
          });
        }
      },
      error: () => {
        message.error('请求失败！');
      },
    });
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection);
  }

  // componentDidMount() {
  //   $.ajax({
  //     url: `http://192.168.43.98:9001/authv1/construct/show`,
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
    const {stepDirection} = this.state;
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

  startBuild() {
    this.setState({step: 1});
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
    const {stepDirection, step, data} = this.state;
    console.log(data);
    return (
      <PageHeaderLayout
        title={data.project_name}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        content={
          <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="创建人">{data.account_name}</Description>
            <Description term="创建时间">{data.create_date}</Description>
            <Description term="描述">{data.project_describe}</Description>
            <Description term="更新时间">{data.update_date}</Description>
          </DescriptionList>
        }
      >
        <Card title="构建进度" style={{marginBottom: 24}} bordered={false}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Steps
              direction={stepDirection}
              progressDot={customDot}
              current={step}
              style={{width: '88%'}}
            >
              <Step title="未构建" />
              <Step title="构建中" />
              <Step title="完成" />
            </Steps>
            <div style={{width: '10%'}}>{this.renderButton(step)}</div>
          </div>
        </Card>
        <Card title="日志信息" style={{marginBottom: 24}} bordered={false}>
          <div className={styles.noData} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
