import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Action from './action'

const Connector = connect(state => ({
  ...state
}), dispatch => ({
  ...bindActionCreators(Action, dispatch)
}))

export default Connector
