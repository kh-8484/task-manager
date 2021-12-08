import { useState } from "react";
// import { Link } from "react-router-dom";
// import M from "materialize-css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

function CreateTodo() {
  const history = useHistory();
  const [task, setTask] = useState("");
  const [expectedDate, setExpectedDate] = useState("");

  const createTask = () => {
    fetch("/user-entry", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        task,
        expectedDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, {
            position: "top-center",
          });
        } else {
          toast.success(data.message, {
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
          margin: "75px auto",
          textAlign: "center",
        }}
      >
        <div className="heading">
          <h1>What's the Plan for Today?</h1>
        </div>
        <div className="input-field col s12">
          <input
            placeholder="Enter you Task to do"
            id="task"
            type="text"
            value={task}
            autoComplete="off"
            required
            onChange={(e) => {
              setTask(e.target.value);
            }}
          />
        </div>
        <div className="input-field col s12">
          <input
            placeholder="mobile No."
            id="mobileno"
            type="date"
            min="2021-12-01"
            value={expectedDate}
            autoComplete="off"
            required
            onChange={(e) => {
              setExpectedDate(e.target.value);
            }}
          />
        </div>
        <div className="input-field col s12">
          <button
            style={{ width: "100%" }}
            className="waves-effect waves-light btn large-btn blue"
            onClick={() => createTask()}
          >
            Create Task
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default CreateTodo;
