let initState = {
  number: 0,
  flt: 1
}

export default (state = initState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        number: state.number + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        number: state.number - 1
      }
    default:
      return state
  }
}