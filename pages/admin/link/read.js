import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Layout from "../../../components/Layout";
import renderHtml from "react-render-html";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import withAdmin from "../../withAdmin";
import { API } from "../../../config";
import { getCookie } from "../../../helpers/auth";
import { errorAlert, successAlert } from "../../../alerts";
import $ from "jquery";

const Links = ({ user, token, links, totalLinks, linkSkip, linksLimit }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);
  const [state, setState] = useState({
    success: "",
    error: "",
  });

  const { success, error } = state;

  const handleClick = async (linkId) => {
    await axios.put(`${API}/click-count`, { linkId });
    window.location.reload();
  };

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
      await axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState({ error: "", success: "Link deleted successfully!" });
      process.browser && window.location.reload();
    } catch (error) {
      console.log(`Link delete error: ${error}`);
      setState({
        error:
          "An error was encountered while deleting the link, please try again.",
        success: "",
      });
    }
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5>{l.title}</h5>
            <h6
              style={{ fontSize: "12px", wordWrap: "break-word" }}
              className="text-danger pt-2"
            >
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="float-right" style={{ fontSize: "13px" }}>
            {moment(l.createdAt).fromNow()} by{" "}
            {l.postedBy.name === user.user.name ? "Me" : l.postedBy.name}
          </span>
          <span className="text-secondary badge pull-left">
            {l.clicks}{" "}
            {(l.clicks === 0 && "views") ||
              (l.clicks === 1 && "view") ||
              (l.clicks > 1 && "views")}
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
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
          {/* Map thru array category in links model to show category title in link comp  */}
          {l.categories.map((c, i) => (
            <span className="badge text-success" key={i}>
              {c.title}
            </span>
          ))}
        </div>
      </div>
    ));
  const loadMore = async () => {
    let toSkip = skip + limit;

    const response = axios.post(
      `${API}/links`,
      { skip: toSkip, limit },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAllLinks([...allLinks, ...(await response).data]);
    setSize((await response).data.length);
    setSkip(toSkip);
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
              style={{ padding: "0px 0px 40px 0px" }}
            >
              <li className="">
                <Link href="/user/link/create">
                  <a
                    className=""
                    style={{ marginLeft: "-3rem", marginBottom: "0px" }}
                  >
                    <i className="fa fa-plus"></i>
                    <span className="pl-2">Submit a Link</span>
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
        <div className="row">
          <div className="col-md-8 offset-md-4">
            <br />
            <br />
            <h1 className="font-weight-bold display-5 mb-3">
              All Published Links
            </h1>
            <br />
            {success && successAlert(success)}
            {error && errorAlert(error)}
            <div className="col-md-12">{listOfLinks()}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={size > 0 && size >= limit}
              loader={
                <div className="loader" key={0}>
                  <img
                    src="/static/images/loader3.gif"
                    alt="Loading..."
                    style={{ width: "auto", height: "200px" }}
                  />
                </div>
              }
            ></InfiniteScroll>
          </div>
        </div>
      </Layout>
    </>
  );
};
Links.getInitialProps = async ({ req }) => {
  let skip = 0;
  let limit = 2;

  const token = getCookie("token", req);

  const response = axios.post(
    `${API}/links`,
    { skip, limit },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    links: (await response).data,
    totalLinks: (await response).data.length,
    linksLimit: limit,
    linkSkip: skip,
    token,
  };
};
export default withAdmin(Links);
