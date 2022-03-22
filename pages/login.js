import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { errorAlert, successAlert } from "../alerts";
import { API } from "../config";
import Link from "next/link";
import { useRouter } from "next/router";
import { authenticate, isAuth } from "../helpers/auth";

const Login = () => {
  const [state, setState] = useState({
    email: "joshsavyy007@gmail.com",
    password: "joshsavyy007@gmail.com",
    error: "",
    success: "",
    buttonText: "Login",
  });
  const Router = useRouter();
  
  useEffect(() => isAuth() && Router.push("/"), []);

  const { email, password, error, success, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Login",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonText: "Logging in...",
    });
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });
      // console.log(response);
      authenticate(response, () =>
        isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user")
      );
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error: error.response.data.error,
        buttonText: "Login",
      });
    }
  };

  const login = () => (
    <form onSubmit={handleSubmit}>
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
        <button id="submit-btn" className="btn btn-outline-dark">
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      
      <div className="col-md-6 offset-md-3">
        <h1>Login</h1>
        {success && successAlert(success)}
        {error && errorAlert(error)}
        <br />
        {JSON.stringify(isAuth())}
        {login()}
        <br />
        <Link href="/auth/password/forgot-password">
          <a className="float-right text-danger">Forgot Password</a>
        </Link>
        {/* <hr />|{JSON.stringify(state)} */}
      </div>
    </Layout>
  );
};

export default Login;
