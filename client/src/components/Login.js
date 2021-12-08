import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
// import M from "materialize-css";
import { UserContext } from "../App";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInUser = () => {
    fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          toast.success("Signed In Successully", {
            position: "top-center",
          });
          window.setTimeout(() => {
            history.push("/user-tasks");
          }, 1500);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div
        className="card row"
        style={{
          maxWidth: "500px",
          padding: "10px",
          margin: "150px auto",
          textAlign: "center",
        }}
      >
        <div className="input-field col s12">
          <input
            placeholder="Email"
            id="email"
            type="email"
            value={email}
            autoComplete="off"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="validate"
          />
        </div>

        <div className="input-field col s12">
          <input
            placeholder="Password"
            id="password"
            type="password"
            value={password}
            autoComplete="off"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="input-field col s12">
          <button
            style={{ width: "100%" }}
            className="waves-effect waves-light btn large-btn blue"
            onClick={() => signInUser()}
          >
            Login{" "}
          </button>

          <h6>
            <Link to="/register">
              <span style={{ color: "black" }}>Don't have an account? </span>
              Register here!
            </Link>
          </h6>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
