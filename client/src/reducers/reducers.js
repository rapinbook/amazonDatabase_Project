const initialState = {
  renderFlag: false,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RERENDER":
      return Object.assign({}, state, { renderFlag: action.payload });
    default:
      return state;
  }
};

export default rootReducer;
