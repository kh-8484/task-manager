import React, { useRef, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../App";

function Navbar() {
  const searchSideNav = useRef(null);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    M.Sidenav.init(searchSideNav.current);
  }, []);

  return (
    <div>
      <nav className="blue">
        <div className="nav-wrapper container">
          <Link to={state ? "/user-tasks" : "/login"} className="brand-logo">
            <h5>Task Manager</h5>
          </Link>
          <a data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              {state ? (
                <Link to="/create-todo">Add Task</Link>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
            <li>
              {state ? (
                <Link to="/user-tasks">View Task's</Link>
              ) : (
                <Link to="/register">Register</Link>
              )}
            </li>

            <li>
              {state ? (
                <button
                  className="btn #c62828 red darken-3 btnLog"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => {
                    localStorage.clear();
                    dispatch({ type: "CLEAR" });
                    history.push("/login");
                  }}
                >
                  Logout
                </button>
              ) : (
                <></>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-demo" ref={searchSideNav}>
        <li
          onClick={() => {
            M.Sidenav.getInstance(searchSideNav.current).close();
          }}
        >
          {state ? (
            <Link to="/create-todo">Add Task</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
        <li
          onClick={() => {
            M.Sidenav.getInstance(searchSideNav.current).close();
          }}
        >
          {state ? (
            <Link to="/user-tasks">View Task's</Link>
          ) : (
            <Link to="/register">Register</Link>
          )}
        </li>
        <li
          onClick={() => {
            M.Sidenav.getInstance(searchSideNav.current).close();
          }}
        >
          {state ? (
            <button
              className="btn #c62828 red darken-3 btnLog"
              style={{ marginLeft: "1.9rem" }}
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/login");
              }}
            >
              Logout
            </button>
          ) : (
            <></>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
