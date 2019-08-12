import { put, call, take, race, all, takeEvery, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ActionTypes, GetMarketsAction, SavePrimaryMarketsAction } from './actions';
import { displayPrimaryMarketsSelector } from './selectors';

export default function* rootWebsocketSaga() {
  yield takeEvery(ActionTypes.START_WEBSOCKET, startWebsocket);
}

function* startWebsocket() {
  const socket = new WebSocket('ws://localhost:8889');
  while (true) {
    const socketChannel = yield call(handleUpdates, socket);
    const { cancel } = yield race({
      task: all([call(externalListener, socketChannel), call(internalListener, socket)]),
      cancel: take(ActionTypes.CLOSE_WEBSOCKET),
    });
    if (cancel) {
      socketChannel.close();
    }
  }
}

function handleUpdates(socket: any) {
  return eventChannel((emit: any) => {
    socket.onopen = () => {
      return emit({type: 'WEBSOCKET_CONNECTED'});
    };

    socket.onmessage = (e: any) => {
      return emit(JSON.parse(e.data));
    };

    return () => {
      socket.close();
    }
  });
}

function* internalListener(socket: any) {
  while (true) {
    const data = yield take(ActionTypes.SOCKET_SEND);
    socket.send(JSON.stringify(data.payload));
  }
}

function* externalListener(socketChannel: any) {
  while (true) {
    const action = yield take(socketChannel);
    switch (action.type) {
      case 'WEBSOCKET_CONNECTED': {
        yield put({type: 'WEBSOCKET_CONNECTED'});
        break;
      }
      case 'EVENT_DATA': {
        yield put(action);
        yield put(new GetMarketsAction({
          events: [action.data],
          withSub: true,
        }));
        break;
      }
      case 'LIVE_EVENTS_DATA': {
        const displayPrimaryMarkets = yield select(displayPrimaryMarketsSelector());
        yield put(action);
        if (displayPrimaryMarkets) {
          yield put(new SavePrimaryMarketsAction(action.data));
          yield put(new GetMarketsAction({
            events: action.data,
            withSub: true
          }));
        }
        break;
      }
      case 'MARKET_DATA': {
        yield put(action);
        break;
      }
      case 'OUTCOME_DATA': {
        yield put(action);
        break;
      }
      case 'CURRENT_SUBSCRIPTIONS': {
        yield put(action);
        break;
      }
      default: {
        yield put(action);
      }
    }
  }
}
