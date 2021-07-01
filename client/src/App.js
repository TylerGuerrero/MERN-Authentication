import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

// Components
import PrivateRoute from './components/routing/PrivateRoute'

// Screens
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <PrivateRoute exact path="/" />
          <Route exact path="/login" component={LoginScreen}/>
          <Route exact path="/register" component={RegisterScreen}/>
          <Route exact path="/forgotpassword" />
          <Route exact path="/login" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
