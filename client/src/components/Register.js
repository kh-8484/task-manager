import { useState } from "react";
import { Link } from "react-router-dom";
// import M from "materialize-css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const createUser = () => {
    fetch("/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { position: "top-center" });
        } else {
          toast.success(data.message, { position: "top-center" });
          window.setTimeout(() => {
            history.push("/login");
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
          margin: "110px auto",
          textAlign: "center",
        }}
      >
        <div className="input-field col s12">
          <input
            placeholder="Name"
            id="name"
            type="text"
            value={name}
            autoComplete="off"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="input-field col s12">
          <input
            placeholder="Email"
            id="email"
            type="text"
            value={email}
            autoComplete="off"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
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
          <input
            placeholder="Confirm Password"
            id="confirm-password"
            type="password"
            value={confirmPassword}
            autoComplete="off"
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <div className="input-field col s12">
          <button
            style={{ width: "100%" }}
            className="waves-effect waves-light btn large-btn blue"
            onClick={() => createUser()}
          >
            Register
          </button>
          <h6>
            <Link to="/login">
              <span style={{ color: "black" }}>Already have an account? </span>
              Login here!
            </Link>
          </h6>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;
