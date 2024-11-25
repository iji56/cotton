import { Reducer } from 'redux';

const round = (number: number) => Math.round(number * 100) / 100;

const monitorReducerEnhancer =
  (createStore: any) =>
  <S, A extends { type: string }>(
    reducer: Reducer<S, A>,
    initialState?: S,
    enhancer?: any,
  ) => {
    const monitoredReducer: Reducer<S, A> = (state, action) => {
      const start = performance.now();
      const newState = reducer(state, action);
      const end = performance.now();
      const diff = round(end - start);

      console.log('reducer process time:', diff);

      return newState;
    };

    return createStore(monitoredReducer, initialState, enhancer);
  };

export default monitorReducerEnhancer;
