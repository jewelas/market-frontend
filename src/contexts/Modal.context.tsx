import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react';

const ModalContext = createContext<any[]>([]);

const useModalContext = () => useContext(ModalContext);

const initialState = () => ({
  isOpen: false
});

const TOGGLE_MODAL = 'modal/TOGGLE_MODAL';

const reducer = (
  state: any,
  { type, payload }: { type: string; payload: { isOpen: boolean } }
) => {
  const { isOpen } = payload;
  switch (type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        isOpen
      };
    default: {
      throw new Error(`Unknown action type ${type}`);
    }
  }
};

export function ModalProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback((payload: any) => {
    dispatch({
      type: TOGGLE_MODAL,
      payload
    });
  }, []);

  return (
    <ModalContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const [state, { update }] = useModalContext();

  const toggleModal = (isOpen: boolean) => {
    update({ isOpen });
  };
  return [state, toggleModal];
};
