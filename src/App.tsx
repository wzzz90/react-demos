import { Route } from 'react-router';
import { HashRouter as Router, Link } from 'react-router-dom';
import Calendar from './calendar';
import Calculator from './calculator';
import './App.css';

function App() {
	return (
		<Router>
			<div className="App">
				<Link to="/">Calendar</Link>
				<Link to="/calendar">Calendar</Link>
				<Link to="/calculator">Calculator</Link>
				<hr />
				<Route path="/" exact component={Calendar}></Route>
				<Route path="/calendar" component={Calendar}></Route>
				<Route path="/calculator" component={Calculator}></Route>
			</div>
		</Router>
	);
}

export default App;
