import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Navbar from "./components/Navbar";
// import UserDetails from "./components/UserDetails";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import { createContext, useReducer, useContext, useEffect } from "react";
import { reducer, initialState } from "./reducer/userReducer";
import CreateTodo from "./components/CreateTodo";
import Tasks from "./components/Tasks";
import EditTask from "./components/EditTask";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/login");
    }
  }, []);
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/create-todo">
        <CreateTodo />
      </Route>
      <Route path="/user-tasks">
        <Tasks />
      </Route>
      <Route path="/edit/:taskid">
        <EditTask />
      </Route>
    </Switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
