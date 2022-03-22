import dynamic from "next/dynamic";
import Layout from "../../../components/Layout";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import withAdmin from "../../withAdmin";
import { useState, useEffect } from "react";
import { API } from "../../../config";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { errorAlert, successAlert } from "../../../alerts";
import $ from "jquery";
import Link from "next/link";

const CreateCategory = ({ user, token }) => {
  const [state, setState] = useState({
    title: "",
    error: "",
    success: "",
    image: "",
    buttonText: "Create",
    imageUploadText: "Upload Image",
  });
  const [imageUploadText, setImageUploadText] = useState("Upload Image");

  const [content, setContent] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState();
  const [dock, setDock] = useState(true);

  const { title, error, success, image, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      error: "",
      success: "",
      [name]: e.target.value,
    });
  };
  const handleContent = (e) => {
    // console.log(e);
    setContent(e);
    setState({ ...state, error: "", success: "" });
  };
  const handleImage = async (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    setImageUploadText(event.target.files[0].name);
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            // console.log(uri);
            setState({ ...state, image: uri, error: "", success: "" });
          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log("base64 conversion error: ", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating..." });
    try {
      // console.log("normal console.log for category form: ", {title,content,image});
      const response = await axios.post(
        `${API}/category`,
        { title, content, image, imageUploadText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        ...state,
        title: "",
        image: "",
        content: "",
        buttonText: "Create",
        success: `${response.data.title} has been created`,
      });
      window.alert(`${response.data.title} has been created`);
      setImageUploadText("Upload Image");
      setContent("");
      console.log("category create resp:", response);
    } catch (error) {
      console.log("category create error:", error);
      setState({
        ...state,
        error: error.response.data.error,
        buttonText: "Create",
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title:</label>
        <input
          required
          type="text"
          onChange={handleChange("title")}
          value={title}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Content:</label>
        <ReactQuill
          value={content}
          placeholder="Write Something..."
          onChange={handleContent}
          className="pb-5 mb-3"
          style={{ border: "1px solid #666" }}
          theme="snow"
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-dark">
          {imageUploadText}
          <input
            required
            type="file"
            name="image"
            id="image"
            accept="image/*"
            hidden
            onChange={handleImage}
            className="form-control"
          />
        </label>
      </div>
      <div>
        <button className="btn btn-outline-dark">{buttonText}</button>
      </div>
    </form>
  );
  const openNav = () => {
    document.getElementById("user_sidebar").style.margin = "0 0 0 0";
    document.getElementById("openNavBtn").style.display = "none";
    document.getElementById("closeNavBtn").style.display = "block";
  };
  const closeNav = () => {
    document.getElementById("user_sidebar").style.margin = "0 0 0 -250%";

    document.getElementById("openNavBtn").style.display = "block";
    document.getElementById("closeNavBtn").style.display = "none";
  };

  const openMenuList = (e, id, iconId) => {
    e.preventDefault();
    if (process.browser) {
      $("#" + id).toggleClass("show");
      $("#" + iconId).toggleClass("fa-angle-up");
    }
  };

  return (
    <>
      <div className="sidebar" id="user_sidebar">
        <br />
        <br />
        <br />
        <h5>
          <span className="text-danger pl-4">
            {user.user.role.charAt(0).toUpperCase() + user.user.role.slice(1)}
          </span>
          's dashboard
        </h5>
        <hr />
        <div>
          <ul style={{ marginLeft: "15px" }}>
            <li className="nav-item admin_dashboard_links rounded">
              <Link href="/admin">
                <div>
                  <div className="float-left">
                    <i className="fa fa-home" style={{ fontSize: "20px" }}></i>
                  </div>
                  <span
                    className="nav-link"
                    style={{ position: "relative", top: "-10px", left: "15px" }}
                  >
                    Dashboard home
                  </span>
                </div>
              </Link>
            </li>
            <li
              className="nav-item admin_dashboard_links rounded"
              onClick={(e) => openMenuList(e, "linksMenu", "linksArrow")}
            >
              <div className="float-left">
                <i className="fa fa-link" style={{ fontSize: "20px" }}></i>
              </div>
              <span
                className="nav-link"
                style={{ position: "relative", top: "-10px", left: "15px" }}
              >
                Links{" "}
                <i
                  id="linksArrow"
                  className=" pl-3 fa fa-angle-right"
                  style={{ fontSize: "22px" }}
                ></i>
              </span>
            </li>
            <ul
              className="hideMenuList list-unstyled"
              id="linksMenu"
              style={{ padding: "0px 0px 60px 0px" }}
            >
              <li className="">
                <Link href="/user/link/create">
                  <a
                    className=""
                    style={{ marginLeft: "-3rem", marginBottom: "5px" }}
                  >
                    <i className="fa fa-plus"></i>
                    <span className="pl-2">Submit a Link</span>
                  </a>
                </Link>
              </li>
              <li className="">
                <Link href="/admin/link/read">
                  <a className="">
                    <i className="fa fa-table"></i>
                    <span className="pl-2">All Published Links</span>
                  </a>
                </Link>
              </li>
            </ul>
            <li className="nav-item admin_dashboard_links rounded">
              <Link href="/user/profile/update">
                <div>
                  <div className="float-left">
                    <i className="fa fa-user" style={{ fontSize: "20px" }}></i>
                  </div>
                  <span
                    className="nav-link"
                    style={{ position: "relative", top: "-10px", left: "15px" }}
                  >
                    Update Profile
                  </span>
                </div>
              </Link>
            </li>
            <li
              className="nav-item admin_dashboard_links rounded"
              onClick={(e) => openMenuList(e, "userMenu", "usersArrow")}
            >
              <div className="float-left">
                <i className="fa fa-users" style={{ fontSize: "20px" }}></i>
              </div>
              <span
                className="nav-link"
                style={{ position: "relative", top: "-10px", left: "15px" }}
              >
                Users{" "}
                <i
                  id="usersArrow"
                  className=" pl-3 fa fa-angle-right"
                  style={{ fontSize: "22px" }}
                ></i>
              </span>
            </li>
            <ul className="hideMenuList list-unstyled" id="userMenu">
              <li className="">
                <Link href="/admin/users">
                  <a
                    className=""
                    style={{ marginLeft: "-3rem", marginBottom: "5px" }}
                  >
                    <i className="fa fa-users"></i> All Users
                  </a>
                </Link>
              </li>
              <li className="">
                <Link href="/admin/users/create">
                  <a className="">
                    <i className="fa fa-user-plus"></i> Add a New User
                  </a>
                </Link>
              </li>
            </ul>
          </ul>
        </div>
      </div>
      <Layout>
        <div className="side-toggle-btn" id="openNavBtn" onClick={openNav}>
          <i className="fa fa-bars text-light"></i>
        </div>
        <div
          className="side-toggle-btn"
          id="closeNavBtn"
          style={{ display: "none" }}
          onClick={closeNav}
        >
          <i className="fa fa-close text-light"></i>
        </div>
        <br />
        <br />
        <br />
        <div className="pull-right col-md-8">
          <div className="col-md-10 offset-md-1">
            <h1>Create Category</h1>
            <br />
            {success && successAlert(success)}
            {error && errorAlert(error)}
            {createCategoryForm()}
          </div>
        </div>
      </Layout>
    </>
  );
};
export default withAdmin(CreateCategory);
