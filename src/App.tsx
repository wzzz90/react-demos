import { Route } from 'react-router';
import { HashRouter as Router, Link } from 'react-router-dom';
import Calendar from './calendar';
import Calculator from './calculator';
import './App.css';

const Navs: React.FC<any> = (props) => {
	return (
		<div>
			<h1>App</h1>
			<ul>
				<li>
					<a to="/about">About</a>
				</li>
				<li>
					<a to="/inbox">Inbox</a>
				</li>
			</ul>
			{props.children}
		</div>
	);
};

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
