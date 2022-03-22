import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { successAlert, errorAlert } from "../../../alerts";
import axios from "axios";
import { API } from "../../../config";
import { getCookie, isAuth } from "../../../helpers/auth";
import withUser from "../../withUser";

const Update = ({ oldLink, token }) => {
  const [state, setState] = useState({
    title: oldLink.title,
    url: oldLink.url,
    categories: oldLink.categories,
    loadedCategories: [],
    success: "",
    error: "",
    type: oldLink.type,
    medium: oldLink.medium,
  });
  const {
    title,
    url,
    categories,
    loadedCategories,
    success,
    error,
    type,
    medium,
  } = state;

  useEffect(() => {
    loadCategories();
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, error: "", success: "" });
  };

  const handleURLChange = (e) => {
    setState({ ...state, url: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dynamicUpdateUrl;
    if (isAuth()) {
      dynamicUpdateUrl = `${API}/link/admin/${oldLink._id}`;
    } else {
      dynamicUpdateUrl = `${API}/link/${oldLink._id}`;
    }

    try {
      const response = await axios.put(
        dynamicUpdateUrl,
        { title, url, categories, medium, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update link response: ", response);
      setState({
        ...state,
        success: "Link has been updated successfully",
        error: "",
      });
    } catch (error) {
      console.log("LINK UPDATE ERROR: ", error);
      setState({ ...state, error: error.response.data.error });
    }
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
            checked={categories.includes(c._id)}
            onChange={handleToggle(c._id)}
            className="mr-2"
          />
          <label className="form-check-label">{c.title}</label>
        </li>
      ))
    );
  };
  //   handleTypeClick
  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: "", error: "" });
  };
  //   handleMediumClick
  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: "", error: "" });
  };
  //   show types
  const showTypes = () => (
    <>
      <div className="form-check ml-5">
        <label className="form-check-input">
          <input
            type="radio"
            onClick={handleTypeClick}
            className="form-check-input"
            value="free"
            checked={type === "free"}
            name="type"
          />
          Free
        </label>
      </div>
      <br />
      <div className="form-check ml-5">
        <label className="form-check-input">
          <input
            type="radio"
            onClick={handleTypeClick}
            className="form-check-input"
            value="paid"
            checked={type === "paid"}
            name="type"
          />
          Paid
        </label>
      </div>
    </>
  );
  //   medium
  const showMedium = () => (
    <>
      <div className="form-check ml-5">
        <label className="form-check-input">
          <input
            type="radio"
            onClick={handleMediumClick}
            className="form-check-input"
            value="book"
            checked={medium === "book"}
            name="medium"
          />
          Book
        </label>
      </div>
      <br />
      <div className="form-check ml-5">
        <label className="form-check-input">
          <input
            type="radio"
            onClick={handleMediumClick}
            className="form-check-input"
            value="video"
            checked={medium === "video"}
            name="medium"
          />
          Video
        </label>
      </div>
      <br />
      <div className="form-check ml-5">
        <label className="form-check-input">
          <input
            type="radio"
            onClick={handleMediumClick}
            className="form-check-input"
            value="website"
            checked={medium === "website"}
            name="medium"
          />
          Website
        </label>
      </div>
    </>
  );
  //   Link create form
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          className="form-control"
          value={title}
          onChange={handleTitleChange}
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">URL</label>
        <input
          className="form-control"
          value={url}
          onChange={handleURLChange}
          type="url"
        />
      </div>
      <div>
        <button
          disabled={!token}
          className="btn btn-outline-dark"
          type="submit"
        >
          Update
        </button>
      </div>
    </form>
  );
  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-md-12">
            <h1>Update Link / {title}</h1>
            <br />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label className="text-muted ml-4">Category</label>
              <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
                {showCategories()}
              </ul>
            </div>
            <div className="form-group">
              <label className="text-muted ml-4">Types</label>
              {showTypes()}
            </div>
            <br />
            <div className="form-group">
              <label className="text-muted ml-4">Medium</label>
              {showMedium()}
            </div>
          </div>
          <div className="col-md-8">
            {success && successAlert(success)}
            {error && errorAlert(error)}
            {submitLinkForm()}
          </div>
        </div>
      </Layout>
    </>
  );
};
Update.getInitialProps = async ({ req, token, query }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return {
    oldLink: response.data,
    token,
  };
};

export default withUser(Update);
