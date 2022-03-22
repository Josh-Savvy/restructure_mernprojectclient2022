import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { errorAlert, successAlert } from "../alerts";
import { API } from "../config";
import { isAuth } from "../helpers/auth";
import { useRouter } from "next/router";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    loadedCategories: [],
    categories: [],
    buttonText: "Register",
  });

  const Router = useRouter();
  useEffect(() => isAuth() && Router.push("/"), []);

  const {
    name,
    email,
    password,
    error,
    loadedCategories,
    categories,
    success,
    buttonText,
  } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleToggle = (c) => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setState({ ...state, categories: all, success: "", error: "" });
  };

  //   show categories > checkbox

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={handleToggle(c._id)}
            className="mr-2"
          />
          <label className="form-check-label">{c.title}</label>
        </li>
      ))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.table({
      name,
      email,
      password,
      categories,
    });
    setState({
      ...state,
      buttonText: "Registering...",
    });
    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        categories,
      });
      console.log(response);
      setState({
        name: "",
        email: "",
        password: "",
        error: "",
        success: response.data.message,
        buttonText: "Submitted",
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error: error.response.data.error,
        buttonText: "Error",
      });
    }
  };

  const registerForm = () => (
    <>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            placeholder="Type your name"
          />
        </div>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Type your email"
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange("password")}
            type="password"
            className="form-control"
            placeholder="Type your password"
          />
        </div>
        <div className="form-group">
          <label className="text-muted ml-4">
            Which topics are you interested in?
          </label>
          <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
            {showCategories()}
          </ul>
        </div>
        <div className="form-group">
          <button id="submit-btn" className="btn btn-outline-dark">
            {buttonText}
          </button>
        </div>
      </form>
    </>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>
        {success && successAlert(success)}
        {error && errorAlert(error)}
        {registerForm()}
      </div>
    </Layout>
  );
};

export default Register;
