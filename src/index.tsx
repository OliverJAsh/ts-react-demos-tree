import { render } from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { RootRouteComponent as DemosRouteComponent } from './demos-components';
import React = require('react');

const App: React.SFC<{}> = () => (
    <Router>
        <div>
            <Link to="/demos">Demos</Link>
            <Route path="/demos" component={DemosRouteComponent} />
        </div>
    </Router>
);

render(<App />, document.getElementById('root'));
