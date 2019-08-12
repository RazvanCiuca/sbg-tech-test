import classNames from 'classnames';
import styles from '../EventDetails/EventDetails.module.scss';
import eventStyles from '../LiveEventList/LiveEventList.module.scss';
import outcomeStyles from './Outcome.module.scss';
import { Collapse } from '@material-ui/core';
import _ from 'lodash';
import React, { useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';


function CorrectScore({
                           market,
                           fractionFormat,
                           fetchMarketOutcomes,
                         }: any) {
  const [hasOutcomes, setHasOutcomes] = useState(!!_.size(market.fetchedOutcomes));
  const [expanded, setExpanded] = useState(true);
  const groupedOutcomes = _.reduce(market.fetchedOutcomes, (groups: any, outcome: any) => {
    groups[outcome.type].push(outcome);
    groups.total += 1;
    return groups;
  }, {
    home: [],
    draw: [],
    away: [],
    total: 0
  });
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
      {groupedOutcomes.total === market.outcomes.length &&
      <Collapse in={expanded} timeout={0}>
          <div className={outcomeStyles.correctScoreWrapper}>
              <div className={outcomeStyles.correctScoreColumn}>
                  <div className={outcomeStyles.columnHeader}>Home</div>
                {groupedOutcomes.home.map((outcome: any, index: number) => (
                  <div className={outcomeStyles.outcome} key={`__home-${index}`}>
                    {outcome.name}
                    <span>
                      {!outcome.status.suspended
                        ? formatPrice(outcome.price, fractionFormat)
                        : 'Suspended'
                      }
                    </span>
                  </div>
                ))
                }
              </div>
              <div className={outcomeStyles.correctScoreColumn}>
                  <div className={outcomeStyles.columnHeader}>Draw</div>
                {groupedOutcomes.draw.map((outcome: any, index: number) => (
                  <div className={outcomeStyles.outcome} key={`__draw-${index}`}>
                    {outcome.name}
                    <span>
                      {!outcome.status.suspended
                        ? formatPrice(outcome.price, fractionFormat)
                        : 'Suspended'
                      }
                    </span>
                  </div>
                ))
                }
              </div>
              <div className={outcomeStyles.correctScoreColumn}>
                  <div className={outcomeStyles.columnHeader}>Away</div>
                {groupedOutcomes.away.map((outcome: any, index: number) => (
                  <div className={outcomeStyles.outcome} key={`__away-${index}`}>
                    {outcome.name}
                    <span>
                    {!outcome.status.suspended
                      ? formatPrice(outcome.price, fractionFormat)
                      : 'Suspended'
                    }
                  </span>
                  </div>
                ))
                }
              </div>
          </div>
      </Collapse>
      }
    </div>
  );
}

export default CorrectScore;