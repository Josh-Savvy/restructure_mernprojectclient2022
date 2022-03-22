import { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { successAlert, errorAlert } from "../../../../alerts";
import { API } from "../../../../config";
import Router, { withRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Link from "next/link";

const ResetPassword = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    buttonText: "Reset",
    newPassword: "",
    error: "",
    success: "",
  });
  const { name, token, buttonText, error, success, newPassword } = state;
  useEffect(() => {
    console.log(router);
    const decoded = jwt.decode(router.query.id);
    if (decoded) {
      setState({ ...state, name: decoded.name, token: router.query.id });
    }
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Connecting..." });
    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      setState({
        ...state,
        newPassword: "",
        buttonText: "Done",
        success: response.data.message,
      });
      window.location.href = "/";
    } catch (error) {
      setState({
        ...state,
        buttonText: "Reset",
        error: error.response.data.error,
      });
    }
  };
  const resetPasswordForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          onChange={handleChange}
          value={newPassword}
          placeHolder="Please input your new password"
          required
        />
        <br />
        <div className="text-center">
          <button className="btn btn-outline-dark w-50">{buttonText}</button>
        </div>
      </div>
    </form>
  );
  const myDate = new Date();
  const hrs = myDate.getHours();

  var greet;

  if (hrs < 12) greet = "Good Morning ";
  else if (hrs >= 12 && hrs <= 17) greet = "Good Afternoon ";
  else if (hrs >= 17 && hrs <= 24) greet = "Good Evening ";

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Reset Password</h1>
          <h4>
            {greet} {name}, Ready to reset your password?
          </h4>
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
export default withRouter(ResetPassword);
