import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { errorAlert, successAlert } from "../../../alerts";
import { API } from "../../../config";
import withUser from "../../withUser";
import Link from "next/link";
import { updateUser } from "../../../helpers/auth";

const ProfileUpdate = ({ user, token }) => {
  const userData = user?.user;
  const [state, setState] = useState({
    name: userData.name,
    email: userData.email,
    categories: userData.categories,
    password: "",
    error: "",
    success: "",
    loadedCategories: [],
    buttonText: "Update",
  });

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

  useEffect(() => {
    success && setTimeout(() => window.location.reload(), 3000);
  }, [success]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
    });
  };

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

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={handleToggle(c._id)}
            className="mr-2"
            checked={categories.includes(c._id)}
          />
          <label className="form-check-label">{c.title}</label>
        </li>
      ))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonText: "Updating...",
    });
    try {
      const response = await axios.put(
        `${API}/user`,
        {
          name,
          password,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateUser(response.data.updated, () => {
        setState({
          error: "",
          success: response.data.message,
          buttonText: "Update",
        });
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error: error.response.data.error,
        buttonText: "Update",
      });
    }
  };

  const updateForm = () => (
    <>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          Name:
          <input
            value={name}
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            placeholder="Type your name"
          />
        </div>
        <div className="form-group">
          Email:
          <input
            value={email}
            disabled
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Type your email"
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
        <div className="row">
          <div className="col form-group">
            <button id="submit-btn" className="btn btn-outline-dark">
              {buttonText}
            </button>
          </div>
          <div className="col form-group">
            <Link href="/">
              <span className="bg-danger rounded p-2 text-white">
                Reset Password
              </span>
            </Link>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <Layout>
      <br />
      <div className="col-md-6 offset-md-3">
        <h1>Update Profile</h1>
        {success && successAlert(success)}
        {error && errorAlert(error)}
        {updateForm()}
      </div>
    </Layout>
  );
};

export default withUser(ProfileUpdate);
