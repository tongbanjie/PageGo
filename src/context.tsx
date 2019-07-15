import * as React from 'react'

interface Props {
  initContext: any
}
const Context = React.createContext({
  state: {},
  setContext: null
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
      <Context.Provider value={{state:this.state, setContext: this.setContext}}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export {Context, Provider}