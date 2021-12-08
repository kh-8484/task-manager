const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/key");
const requireLogin = require("../middleware/requireLogin");

const User = mongoose.model("User");
const UserTasks = mongoose.model("UserTasks");

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else if (name.length < 4) {
    return res
      .status(422)
      .json({ error: "*Name* should have atleast 4 characters" });
  } else if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return res.status(422).json({ error: "*Email* is not valid" });
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
      password
    )
  ) {
    return res.status(422).json({
      error:
        "*Password* must contain atleast 1 lowercase, 1 uppercase, 1 numeric, 1 special character & must be 8 characters or longer",
    });
  } else if (password !== confirmPassword) {
    return res.status(422).json({ error: "Password does not match!" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with this email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Registered successfully" });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter all the feilds" });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid username or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //res.json({ message: "successfuly signed in" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          // console.log(token);
          const { _id, name, email } = savedUser;
          res.json({
            token,
            user: { _id, name, email },
          });
        } else {
          return res
            .status(422)
            .json({ error: "Invalid username or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/user-entry", requireLogin, (req, res) => {
  const { task, expectedDate } = req.body;
  if (!task || !expectedDate) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  var d = expectedDate.split("-");
  var date = d[2] + "/" + d[1] + "/" + d[0];
  const user = new UserTasks({
    task,
    expectedDate: date,
    checked: false,
    createdBy: req.user._id,
  });
  user
    .save()
    .then((user) => {
      res.json({ message: "Task added successfully" });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/alldata", requireLogin, (req, res) => {
  UserTasks.find({ createdBy: req.user._id })
    .sort("_id")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/delete-task", requireLogin, (req, res) => {
  var id = req.body.id;
  UserTasks.findByIdAndDelete(id, function (err, task) {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: "Task Removed Successfully" });
    }
  });
});

router.post("/toggle-task", requireLogin, (req, res) => {
  var id = req.body.id;
  var check = req.body.check;
  UserTasks.findByIdAndUpdate(
    id,
    { checked: check ? false : true },
    function (err, task) {
      if (err) {
        console.log(err);
      } else {
        res.json({ message: "Updated Successfully" });
        // console.log(task);
      }
    }
  );
});

router.get("/edit/:id", requireLogin, (req, res) => {
  const id = req.params.id.trim();

  UserTasks.findOne({ _id: id })
    .then((userTask) => {
      res.json({ userTask });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.post("/task-update", requireLogin, (req, res) => {
  var id = req.body.id.trim();
  var d = req.body.expectedDate.split("-");
  var date = d[2] + "/" + d[1] + "/" + d[0];
  if (!req.body.task || !req.body.expectedDate) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  UserTasks.findByIdAndUpdate(
    id,
    { task: req.body.task, expectedDate: date },
    function (err, task) {
      if (err) {
        console.log(err);
      } else {
        res.json({ message: "Updated Successfully" });
      }
    }
  );
});

module.exports = router;
