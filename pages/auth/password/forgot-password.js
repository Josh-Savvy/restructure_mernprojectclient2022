import { useState, useEffect } from "react";
import axios from "axios";
import { successAlert, errorAlert } from "../../../alerts";
import { API } from "../../../config";
import Router from "next/router";
import Layout from "../../../components/Layout";
import Link from "next/link";

const forgotPassword = () => {
  const [state, setState] = useState({
    email: "",
    buttonText: "Send",
    error: "",
    success: "",
  });
  const { email, buttonText, error, success } = state;
  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Sending..." });
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      setState({
        ...state,
        email: "",
        buttonText: "Sent",
        success: response.data.message,
      });
      console.log("Forgot password response: ", response);
    } catch (error) {
      console.log("Forgot Password error: ", error);
      setState({
        ...state,
        buttonText: "Send",
        error: error.response.data.error,
      });
    }
  };

  const resetPasswordForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          onChange={handleChange}
          value={email}
          placeHolder="Please input your registered email address."
          required
        />
        <br />
        <div className="text-center">
          <button className="btn btn-outline-dark w-50">{buttonText}</button>
        </div>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Reset Password</h1>
          <div>
            {success && successAlert(success)}
            {error && errorAlert(error)}
          </div>
          <br />
          {resetPasswordForm()}
        </div>
      </div>
    </Layout>
  );
};
export default forgotPassword;
