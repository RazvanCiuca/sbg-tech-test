import styles from './LiveEventList.module.scss';
import React from 'react';
import EventType from './EventType';
import _ from 'lodash';
import {
  FormControlLabel,
  Checkbox,
  Button,
} from '@material-ui/core';
import { Dispatch } from 'redux';
import {
  boostCounterSelector,
  displayableEventsSelector,
  groupedDisplayableEventsSelector, priceFormatSelector,
} from '../../redux/selectors';
import { connect } from 'react-redux';
import { TogglePriceFormatAction } from '../../redux/actions';

class LiveEventsList extends React.PureComponent<any> {
  public state = {
    showPrimaryMarkets: false
  };

  public render() {
    const {
      boostCount,
      groupedEventIds,
    } = this.props;
    return (
      <div className={styles.liveEventList}>
        <div className={styles.sportTypeHeader}>
          <div className={styles.sportTypeHeaderTitle}>Football</div>
          <div className={'spacer'} />
          <div className={styles.toggle}>
            <FormControlLabel
              labelPlacement='start'
              control={
                <Checkbox
                  checked={this.state.showPrimaryMarkets}
                  onChange={this.togglePrimaryMarketDisplay}
                  value="true"
                  className={styles.primaryMarketCheckbox}
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
              }
              label="Show Primary Markets"
            />

          </div>
          <div className={'spacer'} />
          <div>
            <Button onClick={this.togglePriceFormat} color={'primary'} variant={'contained'}>
              Toggle Price Format
            </Button>
          </div>
          <div className={'spacer'} />
          <div className={styles.boostCounterWrapper}>
            <div className={styles.boostCounter}>
              {boostCount} Boosts
            </div>
          </div>
        </div>
        <div>
          { _.map(groupedEventIds, (group, key) => (
              <EventType
                key={`__eventType-${key}`}
                type={{
                  eventIds: group,
                  typeName: key,
                }}
                showPrimaryMarkets={this.state.showPrimaryMarkets}
              />
            ))
          }
        </div>
      </div>
    );
  }

  private togglePrimaryMarketDisplay = (event: any) => {
    this.setState({
      showPrimaryMarkets: !this.state.showPrimaryMarkets
    });

    this.props.togglePrimaryMarketDisplay(!this.state.showPrimaryMarkets);
  }

  private togglePriceFormat = () => {
    const {
      priceFormat,
      togglePriceFormat
    } = this.props;
    const newPriceFormat = priceFormat === 'fraction' ? 'decimal' : 'fraction';
    localStorage.setItem('priceFormat', newPriceFormat);
    togglePriceFormat(newPriceFormat);
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    togglePriceFormat: (fractionFormat: string) => {
      dispatch(new TogglePriceFormatAction(fractionFormat))
    }
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    eventIds: displayableEventsSelector()(state),
    groupedEventIds: groupedDisplayableEventsSelector()(state),
    boostCount: boostCounterSelector()(state),
    priceFormat: priceFormatSelector()(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveEventsList);