import * as actions from './actions.js'

export const mapStateToProps = state => {
  return {
    renderFlag: state.renderFlag,
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    reRender: bool => {dispatch(actions.reRender(bool))}
  };
};
