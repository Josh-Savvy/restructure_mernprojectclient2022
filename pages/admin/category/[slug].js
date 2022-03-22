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
import Sidebar from "react-sidebar";
import Link from "next/link";

const UpdateCategory = ({ user, oldCategory, token }) => {
  const [state, setState] = useState({
    title: oldCategory.title,
    error: "",
    success: "",
    image: "",
    imagePreview: oldCategory.image.url,
    buttonText: "Update",
  });
  const [imageUploadText, setImageUploadText] = useState("Upload new Image");

  const [content, setContent] = useState(oldCategory.content);

  const [sidebarOpen, setSidebarOpen] = useState();
  const [dock, setDock] = useState(true);

  const { title, error, success, image, buttonText, imagePreview } = state;

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
  const handleImage = async (e) => {
    let fileInput = false;
    if (e.target.files[0]) {
      fileInput = true;
    }
    setImageUploadText(e.target.files[0].name);
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          e.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
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
    setState({ ...state, buttonText: "Updating..." });

    await axios
      .put(
        `${API}/category/${oldCategory.slug}`,
        { title, content, image, imageUploadText, imagePreview },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setState({
          ...state,
          title: response.data.title,
          image: response.data.image.url,
          imagePreview: response.data.image.url,
          buttonText: "Update",
          success: `${response.data.title} has been updated`,
        });

        setContent(response.data.content);
        // window.alert(`${response.data.title} has been updated`);
        // setImageUploadText("Upload new Image");
        console.log("category create resp:", response);
      })
      .catch((error) => {
        console.log("category create error:", error);
        setState({
          ...state,
          title: "",
          error: error.response.data.error,
          buttonText: "Update",
        });
      });
  };

  const updateCategoryForm = () => (
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
          {imageUploadText}{" "}
          <input
            required
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImage(e)}
            className="form-control"
          />
          <img src={imagePreview} alt="image" height="25px" />
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
  return (
    <>
      <div className="sidebar" id="user_sidebar">
        <br />
        <br />
        <br />
        <h5>
          {user.user.name}'s dashboard/
          <span className="text-danger">{user.user.role}</span>
        </h5>
        <hr />
        <div>
          <ul>
            <li className="nav-item admin_dashboard_links">
              <Link href="/admin">
                <a className="nav-link ">
                  <i className="fa fa-home"></i> Admin
                </a>
              </Link>
            </li>
            <li className="nav-item admin_dashboard_links">
              <Link href="/admin/category/create">
                <a className="nav-link ">
                  <i className="fa fa-plus"></i> Create Category
                </a>
              </Link>
            </li>
            <li className="nav-item admin_dashboard_links">
              <Link href="/user/link/create">
                <a className="nav-link " style={{ borderRadius: "0px" }}>
                  <i className="fa fa-send-o"></i> Submit a link
                </a>
              </Link>
            </li>
            <li className="nav-item admin_dashboard_links">
              <Link href="/admin/link/read">
                <a className="nav-link ">
                  <i className="fa fa-table"></i> All Published Links
                </a>
              </Link>
            </li>
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
            <h2>Update Category [{oldCategory.title}]</h2>
            <br />
            {success && successAlert(success)}
            {error && errorAlert(error)}
            {updateCategoryForm()}
          </div>
        </div>
      </Layout>
    </>
  );
};
UpdateCategory.getInitialProps = async ({ req, query, token }) => {
  const response = await axios.post(`${API}/category/${query.slug}`);
  return {
    oldCategory: response.data.category,
    token,
  };
};
export default withAdmin(UpdateCategory);
