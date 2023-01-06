import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from 'react';

const AlertContext = createContext<any[]>([]);

const useAlertContext = () => useContext(AlertContext);

const initialState = () => ({
  isVisible: false,
  message: null,
});

const TOGGLE_ALERT = 'alert/TOGGLE_ALERT';

const reducer = (state: any, {type, payload}: any) => {
  const {message, isVisible} = payload;
  switch (type) {
    case TOGGLE_ALERT:
      return {
        ...state,
        isVisible,
        message,
      };
    default: {
      throw new Error(`Unknown action type ${type}`);
    }
  }
};

export default function AlertProvider({children}: any) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback(payload => {
    dispatch({
      type: TOGGLE_ALERT,
      payload,
    });
  }, []);

  return (
    <AlertContext.Provider
      value={useMemo(() => [state, {update}], [state, update])}>
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const [state, {update}] = useAlertContext();

  const toggle = ({isVisible, message}: any) => update({isVisible, message});

  return [state, toggle];
};
