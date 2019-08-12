import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SocketSendAction, SocketStartAction } from '../../redux/actions';
import { websocketConnectedSelector } from '../../redux/selectors';
import skybetLogo from '../../assets/skybet.png';

import LiveEventsList from '../../components/LiveEventList';
import homeStyles from './Home.module.scss';

interface IHomeProps {
  liveEvents?: any[];
  websocketConnected?: boolean;
  priceFormat: string;
  getLiveEvents: (primaryMarkets?: boolean) => void;
  togglePriceFormat: (useFractionFormat?: string) => void;
  startWebsocketConnection: () => void;
}

interface IHomeState {
  subscribedToLiveEvents: boolean;
  arePrimaryMarketsFetched: boolean;
}

class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      subscribedToLiveEvents: false,
      arePrimaryMarketsFetched: false,
    };
  }

  public componentDidMount(): void {
    const {
      startWebsocketConnection,
    } = this.props;
    startWebsocketConnection();
  }

  public componentDidUpdate(prevProps: Readonly<IHomeProps>, prevState: Readonly<{}>, snapshot?: any): void {
    const {
      websocketConnected,
    } = this.props;
    if (websocketConnected && !this.state.subscribedToLiveEvents) {
      this.setState({
        subscribedToLiveEvents: true
      });
      this.togglePrimaryMarketDisplay(false);
    }
  }

  public render() {
    return (
      <div className={homeStyles.homeContainer}>
        <div className={homeStyles.header}>
          <img src={skybetLogo} alt="skybet-logo"/>
        </div>
        <LiveEventsList
          togglePrimaryMarketDisplay={this.togglePrimaryMarketDisplay}
        />
      </div>
    )
  }

  private togglePrimaryMarketDisplay = (displayPrimaryMarkets: boolean) => {
    if (!this.state.arePrimaryMarketsFetched) {
      this.props.getLiveEvents(displayPrimaryMarkets);
      if (displayPrimaryMarkets) {
        this.setState({
          arePrimaryMarketsFetched: true,
        });
      }
    }
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getLiveEvents: (primaryMarkets: boolean = false) => {
      dispatch(new SocketSendAction({
        type: "getLiveEvents",
        primaryMarkets
      }));
    },
    startWebsocketConnection: () => {
      dispatch(new SocketStartAction({}))
    },
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    websocketConnected: websocketConnectedSelector()(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);