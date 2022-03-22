import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import Sidebar from "react-sidebar";
import Layout from "../../components/Layout";
import { API } from "../../config";
import withAdmin from "../withAdmin";
import $ from "jquery";

const Admin = ({ user, token }) => {
  const [sidebarOpen, setSidebarOpen] = useState();
  const [dock, setDock] = useState(true);
  const [state, setState] = useState({
    error: "",
    success: "",
    categories: [],
  });

  const { error, success, categories } = state;

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, categories: response.data });
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`${slug} deleted`);
      console.log(`Category delete success: ${response}`);
      // Reload remaining catgories
      loadCategories();
    } catch (error) {
      console.log(`Category delete error: ${error}`);
    }
  };

  const confirmDelete = (slug) => {
    console.log(`Delete ${slug} confirmation ??`);
    const deleteConfirmed = window.confirm(
      `This action is irreversible. Do you want to delete ${slug}?`
    );
    if (deleteConfirmed) {
      handleDelete(slug);
    } else {
      console.log(`Delete ${slug} confirmation declined`);
    }
  };

  const listCategories = () =>
    categories.map((c, i) => (
      <>
        <div
          className="row rounded bg-light p-2 col-md-12 mb-3"
          style={{ boxShadow: "0 1px 3px rgb(23 23 23 / 24%)" }}
          key={i}
        >
          <div className="col-md-8">
            <Link href={`/links/${c.slug}`}>
              <a>
                <div className="row">
                  <div className="col-md-4">
                    <img
                      src={c.image && c.image.url}
                      alt={c.name}
                      style={{
                        width: "60px",
                        height: "auto",
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <h5>{c.title}</h5>
                  </div>
                </div>
              </a>
            </Link>
          </div>

          <div className="col-md-4">
            <Link href={`/admin/category/${c.slug}`}>
              <a className="btn btn-sm btn-outline-success btn-block mb-span">
                Update
              </a>
            </Link>
            <button
              className="btn btn-sm btn-outline-danger btn-block"
              onClick={(e) => confirmDelete(c.slug)}
            >
              Delete
            </button>
          </div>
        </div>
      </>
    ));

  useEffect(() => {
    loadCategories();
  }, []);

  const openMenuList = (e, id, iconId) => {
    e.preventDefault();
    if (process.browser) {
      $("#" + id).toggleClass("show");
      $("#" + iconId).toggleClass("fa-angle-up");
    }
  };

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
        <span
          className="bg-success p-2 rounded text-light"
          style={{ userSelect: "none"}}
        >
          {user.user.role.charAt(0).toUpperCase() + user.user.role.slice(1)}
        </span>
        <br />
        <br />
        <div>
          <h5>
            <span className="text-danger pl-4">
              {user.user.name.split(" ").shift().charAt(0).toUpperCase() +
                user.user.name.split(" ").shift().slice(1)}
            </span>
            's dashboard
          </h5>
        </div>

        <hr />
        <div>
          <ul style={{ marginLeft: "15px" }}>
            <li className="nav-item admin_dashboard_links rounded">
              <Link href="/admin/category/create">
                <div>
                  <div className="float-left">
                    <i className="fa fa-plus" style={{ fontSize: "20px" }}></i>
                  </div>
                  <span
                    className="nav-link"
                    style={{ position: "relative", top: "-10px", left: "15px" }}
                  >
                    Create New Category
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
          <i
            className="fa fa-close text-light"
            style={{ fontSize: "20px" }}
          ></i>
        </div>
        <br />
        <div className="offset-md-4">
          <div className="row pull-right col-md-12 ">
            <div className="col-md-8">
              <h2>All Categories</h2>
              {listCategories()}
            </div>
            <div className="col-md-4">Right hand side</div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default withAdmin(Admin);
