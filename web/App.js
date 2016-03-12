import React from 'react';
import SocketMessageList from './components/SocketMessageList';
import config from './config';

/*
class App extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.text}</h1> 
                <CatCount />
                <CatColor />
            </div>
        );
    }
}

App.propTypes = {
    text: React.PropTypes.string
};

App.defaultProps = {
    text: 'This is the default text!'
};
*/

const App = () => <SocketMessageList {...config} />;
export default App;

