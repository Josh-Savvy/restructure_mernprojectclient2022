import { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { successAlert, errorAlert } from "../../../alerts";
import { API } from "../../../config";
import { withRouter } from "next/router";
import Layout from "../../../components/Layout";
import Link from "next/link";

const ActivateAccount = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    buttonText: "Activate Account",
    linkBackHome: "",
    error: "",
    success: "",
  });
  const { name, token, buttonText, error, success, linkBackHome } = state;

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const { name } = jwt.decode(token);
      setState({ ...state, name, token });
    }
  }, [router]);

  const clickSubmit = async (e) => {
    e.preventDefault();
    // console.log("Clicked!");
    setState({ ...state, buttonText: "Activating..." });
    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      setState({
        ...state,
        name: "",
        token: "",
        error: "",
        success: response.data.message,
        buttonText: "Account Activated",
        linkBackHome: "Go to your dashboard",
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Activate",
        error: error.response.data.error,
      });
    }
  };

  var myDate = new Date();
  var hrs = myDate.getHours();

  var greet;

  if (hrs < 12) greet = "Good Morning ";
  else if (hrs >= 12 && hrs <= 17) greet = "Good Afternoon ";
  else if (hrs >= 17 && hrs <= 24) greet = "Good Evening ";

  return (
    <Layout>
      <div className="row">
        <div className="col-lg-6 col-md-5 offset-md-3 text-center">
          <h1>
            {greet} {name}, Are you ready to activate your account?
          </h1>
          <br />
          {success && successAlert(success)}
          {error && errorAlert(error)}
          <button onClick={clickSubmit} className="btn btn-outline-dark">
            {buttonText}
          </button>
          <br />
          <br />
          <Link href="/user" className="btn btn-outline-dark">
            {linkBackHome}
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
