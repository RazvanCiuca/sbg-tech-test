import classNames from 'classnames';
import styles from '../EventDetails/EventDetails.module.scss';
import eventStyles from '../LiveEventList/LiveEventList.module.scss';
import { Collapse } from '@material-ui/core';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';


function StandardOutcome({
    market,
    fractionFormat,
    fetchMarketOutcomes,
  }: any) {
  const [hasOutcomes, setHasOutcomes] = useState(!!_.size(market.fetchedOutcomes));
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    if (!hasOutcomes && !!_.size(market.fetchedOutcomes)) {
      setHasOutcomes(true);
    }
  }, [hasOutcomes, market.fetchedOutcomes]);
  return (
    <div className={classNames(styles.eventMarket, eventStyles.eventMarket)}>
      <div className={eventStyles.marketName} onClick={() => {
        if (!hasOutcomes) {
          fetchMarketOutcomes(market);
          setHasOutcomes(true);
        } else {
          setExpanded(!expanded);
        }
      }}>
        {market.name}
      </div>
      <Collapse in={expanded} timeout={0}>
        { _(market.fetchedOutcomes)
          .values()
          .filter((outcome: any) => outcome.status.displayable)
          .value()
          .map((outcome, index) => (
            <div className={eventStyles.marketOutcome} key={`__outcome-${index}`}>
              <div className={eventStyles.outcomeName}>
                {outcome.name}
              </div>
              <div className={eventStyles.outcomePrice}>
                { !outcome.status.suspended
                   ? formatPrice(outcome.price, fractionFormat)
                   : 'Suspended'
                }
              </div>
            </div>
          ))}
      </Collapse>
    </div>
  );
}

export default StandardOutcome;