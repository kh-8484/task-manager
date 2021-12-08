import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Tasks() {
  const [data, setData] = useState([]);

  // const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  // useEffect(() => {
  //   window.addEventListener(
  //     "resize",
  //     () => {
  //       const ismobile = window.innerWidth < 480;
  //       if (ismobile !== isMobile) setIsMobile(ismobile);
  //     },
  //     false
  //   );
  //   console.log(isMobile);
  // }, [isMobile]);

  useEffect(() => {
    fetch("/alldata", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((details) => {
        setData(details);
      });
  }, [data]);

  const deleteTask = (taskid) => {
    fetch("/delete-task", {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        id: taskid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.message, { position: "top-center" });
      });
  };

  const toggleChecked = (taskid, checked) => {
    fetch("/toggle-task", {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        id: taskid,
        check: checked,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // toast.success(data.message, { position: "top-center" });
      });
  };

  return (
    <>
      <div>
        <div className="heading-button" style={{ marginBottom: "-1rem" }}>
          <Link to="/create-todo">
            <h1>📝 Add a new Task</h1>
          </Link>
        </div>

        <div className="heading">
          <h1>📅📆 Task's To do!!</h1>
        </div>

        <div style={{ overflowX: "auto" }} className="container">
          <table
            className="striped centered"
            style={{
              fontSize: "1.2rem",
              // tableLayout: isMobile ? "auto" : "fixed",
              width: "100%",
            }}
          >
            <thead style={{ fontSize: "1.1rem" }}>
              <tr>
                <th className="table-head1" style={{ width: "10%" }}>
                  Status
                </th>
                <th className="table-head2" style={{ width: "60%" }}>
                  Task
                </th>
                <th className="table-head3" style={{ width: "15%" }}>
                  Expected Date
                </th>
                <th className="table-head4" style={{ width: "8%" }}>
                  Edit
                </th>
                <th className="table-head5" style={{ width: "8%" }}>
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                return (
                  <tr>
                    <td>
                      <label>
                        <input
                          onClick={() => toggleChecked(item._id, item.checked)}
                          type="checkbox"
                          className="filled-in"
                          checked={item.checked ? "checked" : ""}
                        />
                        <span></span>
                      </label>
                    </td>
                    <td
                      className="task"
                      style={{
                        textDecoration: item.checked ? "line-through" : "none",
                      }}
                    >
                      {item.task}
                    </td>
                    <td>{item.expectedDate}</td>
                    <td>
                      <Link to={"/edit/ " + item._id}>
                        <i className="material-icons">edit</i>
                      </Link>
                    </td>
                    <td>
                      <i
                        className="material-icons red-text text-darken-4"
                        onClick={() => deleteTask(item._id)}
                      >
                        delete
                      </i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Tasks;
