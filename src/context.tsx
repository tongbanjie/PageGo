import * as React from 'react'

const useReducer = React.useReducer;

interface Props {
  initContext: any
}

const Context = React.createContext({
  state: {},
  setContext: null,
  dispatch: null
});

class Provider extends React.Component<Props> {
  constructor(props:Props) {
    super(props);
    this.state = props.initContext;
  }

  setContext = (state) => {
    this.setState(state);
  }

  render() {
    return (
      <Context.Provider value={{state:this.state, setContext: this.setContext, dispatch: null}}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

// 如果是hook 可以使用useReducer来包装Provider
const ReducerProvider = (props) => {
  const [state, dispatch] = useReducer(props.reducer, props.initContext);

  return (
    <Context.Provider value={{ state, dispatch, setContext:null }}>
      {props.children}
    </Context.Provider>
  );
};


export {Context, Provider, ReducerProvider}