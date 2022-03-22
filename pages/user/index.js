import Layout from "../../components/Layout";
import withUser from "../withUser";
import { getCookie } from "../../helpers/auth";
import axios from "axios";
import { API } from "../../config";
import Link from "next/link";
import moment from "moment";
import Router from "next/router";
import { successAlert, errorAlert } from "../../alerts";
import { useState } from "react";

const User = ({ user, allLinks, token, query }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
  });
  const { success, error } = state;

  const confirmDelete = (e, id) => {
    e.preventDefault();
    console.log(`Delete ${id} confirmation ??`);
    const deleteConfirmed = window.confirm(
      `Are you sure you want to delete this link? This action is irreversible!`
    );
    if (deleteConfirmed) {
      handleDelete(id);
    } else {
      console.log(`Delete ${id} declined`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Reload remaining links
      Router.replace("/user");
      setState({ ...state, success: response.data.message });
    } catch (error) {
      console.log(`Link delete error: ${error}`);
      setState({ ...state, error: error.response.data.error });
    }
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    window.location.reload();
  };

  const listLinks = () =>
    allLinks.map((l, i) => (
      <div className="row alert alert-primary p-2">
        <div className="col-md-8">
          <a href={l.url} target="_blank" onClick={(e) => handleClick(l._id)}>
            <h6>{l.title}</h6>
            <h6 style={{ fontSize: "12px" }} className="text-danger pt-2">
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="float-right">
            {moment(l.createdAt).fromNow()} by{" "}
            {l.postedBy.name === user.user.name ? "Me" : l.postedBy.name}
          </span>
          <span className="text-secondary badge pull-right">
            {l.clicks}{" "}
            {(l.clicks === 0 && "views") ||
              (l.clicks === 1 && "view") ||
              (l.clicks > 1 && "views")}
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark float-left">
            {l.type} {l.medium}
          </span>
          <span
          id="user_delete_btn"
            onClick={(e) => confirmDelete(e, l._id)}
            className="btn badge text-danger pull-right"
          >
            Delete
          </span>
          <Link href={`/user/link/${l._id}`}>
            <a className="nav-link badge text-warning pull-right">Update</a>
          </Link>
          {/* Map thru category array  in links model to show each category  */}
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success pull-left">
              {c.slug}
            </span>
          ))}
        </div>
      </div>
    ));

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
        <ul>
          <li className="list-unstyled">
            <Link href="/user/link/create">
              <a className="nav-link">
                <i className="fa fa-plus"></i> Submit Link
              </a>
            </Link>
          </li>
          <li className="list-unstyled">
            <Link href="/user/profile/update">
              <a className="nav-link text-success">
                <i className="fa fa-user"></i> Update Profile
              </a>
            </Link>
          </li>
        </ul>
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
        <div className="row">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <br />
            <h4>My Published Links</h4>
            {success && successAlert(success)}
            {error && errorAlert(error)}
            <br />
            <div>{listLinks()}</div>
            {/* {JSON.stringify(allLinks)} */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default withUser(User);
