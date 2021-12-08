import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useParams } from "react-router-dom";

function CreateTodo() {
  const history = useHistory();
  const { taskid } = useParams();

  const [task, setTask] = useState("");
  //   const [data, setData] = useState(null);
  const [expectedDate, setExpectedDate] = useState("");

  useEffect(() => {
    fetch(`/edit/${taskid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setTask(result.userTask.task);
        var d = result.userTask.expectedDate.split("/");
        setExpectedDate(d[2] + "-" + d[1] + "-" + d[0]);
      });
  }, []);
  const updateTask = () => {
    fetch("/task-update", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        id: taskid,
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
          <h1>Update your Task 📝</h1>
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
            onClick={() => updateTask()}
          >
            Update
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default CreateTodo;
