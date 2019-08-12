import _ from 'lodash';

const initialState = {
  priceFormat: localStorage.getItem('priceFormat') || 'fraction',
  websocketConnected: false,
  displayPrimaryMarkets: false,
  liveEvents: {},
  currentSubscriptions: [],
  primaryMarkets: [],
};

export default function(state: any = initialState, action: any) {
  switch (action.type) {
    case 'EVENT_DATA': {
      const { eventId } = action.data;
      return Object.assign({}, {
        ...state,
        liveEvents: {
          ...state.liveEvents,
          [eventId]: {
            ...state.liveEvents[eventId],
            ...action.data,
          }
        }
      });
    }
    case 'LIVE_EVENTS_DATA': {
      return Object.assign({}, {
        ...state,
        liveEvents: action.data.reduce((events: any, event: any) => {
          events[event.eventId] = {
            ...event,
            markets: event.markets || [],
            primaryMarket: event.markets ? event.markets[0] : null
          };
          return events;
        }, {})
      });
    }
    case 'MARKET_DATA': {
      const { eventId, marketId } = action.data;
      let affectedEvent = state.liveEvents[eventId];
      const updatedMarkets = affectedEvent.fetchedMarkets || {};
      updatedMarkets[marketId] = {
        ...updatedMarkets[marketId],
        ...action.data
      };
      affectedEvent = {
        ...affectedEvent,
        fetchedMarkets: updatedMarkets,
      };
      return Object.assign({}, {
        ...state,
        liveEvents: {
          ...state.liveEvents,
          [eventId]: affectedEvent
        }
      });
    }
    case 'MARKET_STATUS': {
      const { eventId, marketId } = action.data;
      const affectedMarket = _.get(state, ['liveEvents', eventId, 'fetchedMarkets', marketId], null);
      if (affectedMarket) {
        affectedMarket.status = action.data.status;
        return Object.assign({}, {
          ...state,
          liveEvents: {
            ...state.liveEvents,
            [eventId]: {
              ...state.liveEvents[eventId],
              fetchedMarkets: {
                ...state.liveEvents[eventId].fetchedMarkets,
                [marketId]: {
                  ...affectedMarket,
                }
              }
            }
          }
        });
      }
      return state;
    }
    case 'OUTCOME_DATA': {
      const { eventId, marketId, outcomeId } = action.data;
      const affectedMarket = _.get(state, ['liveEvents', eventId, 'fetchedMarkets', marketId], null);
      if (affectedMarket) {
        const updatedOutcomes = affectedMarket.fetchedOutcomes || {};
        updatedOutcomes[action.data.outcomeId] = action.data;
        return Object.assign({}, {
          ...state,
          liveEvents: {
            ...state.liveEvents,
            [eventId]: {
              ...state.liveEvents[eventId],
              fetchedMarkets: {
                ...state.liveEvents[eventId].fetchedMarkets,
                [marketId]: {
                  ...state.liveEvents[eventId].fetchedMarkets[marketId],
                  fetchedOutcomes: {
                    ...state.liveEvents[eventId].fetchedMarkets[marketId].fetchedOutcomes,
                    [outcomeId]: action.data
                  }
                }
              }
            }
          }
        });
      }
      return state;
    }
    case 'PRICE_CHANGE': {
      const { eventId, marketId, outcomeId } = action.data;
      const affectedOutcome: any = _.get(state, ['liveEvents', eventId, 'fetchedMarkets', marketId, 'fetchedOutcomes', outcomeId], null);
      if (affectedOutcome) {
        affectedOutcome.price = action.data.price;
        return Object.assign({}, {
          ...state,
          liveEvents: {
            ...state.liveEvents,
            [eventId]: {
              ...state.liveEvents[eventId],
              fetchedMarkets: {
                ...state.liveEvents[eventId].fetchedMarkets,
                [marketId]: {
                  ...state.liveEvents[eventId].fetchedMarkets[marketId],
                  fetchedOutcomes: {
                    ...state.liveEvents[eventId].fetchedMarkets[marketId].fetchedOutcomes,
                    [outcomeId]: {
                      ...affectedOutcome,
                    }
                  }
                }
              }
            }
          }
        });
      }
      return state;
    }
    case 'OUTCOME_STATUS': {
      const { eventId, marketId, outcomeId } = action.data;
      const affectedOutcome: any = _.get(state, ['liveEvents', eventId, 'fetchedMarkets', marketId, 'fetchedOutcomes', outcomeId], null);
      if (affectedOutcome) {
        affectedOutcome.status = action.data.status;
        return Object.assign({}, {
          ...state,
          liveEvents: {
            ...state.liveEvents,
            [eventId]: {
              ...state.liveEvents[eventId],
              fetchedMarkets: {
                ...state.liveEvents[eventId].fetchedMarkets,
                [marketId]: {
                  ...state.liveEvents[eventId].fetchedMarkets[marketId],
                  fetchedOutcomes: {
                    ...state.liveEvents[eventId].fetchedMarkets[marketId].fetchedOutcomes,
                    [outcomeId]: {
                      ...affectedOutcome
                    }
                  }
                }
              }
            }
          }
        });
      }
      return state;
    }
    case 'CURRENT_SUBSCRIPTIONS': {
      return Object.assign({}, {
        ...state,
        currentSubscriptions: action.data
      });
    }
    case 'SAVE_PRIMARY_MARKETS': {
      return Object.assign({}, {
        ...state,
        primaryMarkets: _.reduce(action.payload, (markets: any, event: any) => {
          markets.push(`m.${event.markets[0]}`);
          return markets;
        }, [])
      });
    }
    case 'WEBSOCKET_CONNECTED': {
      return Object.assign({}, {
        ...state,
        websocketConnected: true
      });
    }
    case 'SOCKET_SEND': {
      if (action.payload.type === 'getLiveEvents') {
        return Object.assign({}, {
          ...state,
          displayPrimaryMarkets: action.payload.primaryMarkets
        })
      }
      return state;
    }
    case 'TOGGLE_PRICE_FORMAT': {
      return {
        ...state,
        priceFormat: action.payload
      }
    }
    default: {
      return state;
    }
  }
}