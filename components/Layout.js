import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { isAuth, logout } from "../helpers/auth";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const head = () => (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <link rel="stylesheet" href="/static/css/styles.css" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );

  const nav = () => (
    <ul className="nav nav-tabs bg-dark">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-light">Home</a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/user/link/create">
          <a
            className="nav-link text-light btn btn-primary"
            style={{ borderRadius: "0px" }}
          >
            Submit a link
          </a>
        </Link>
      </li>
      {!isAuth() && (
        <>
          <li className="nav-item">
            <Link href="/login">
              <a className="nav-link text-light">Login</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/register">
              <a className="nav-link text-light">Register</a>
            </Link>
          </li>
        </>
      )}

      {isAuth() && isAuth().role === "subscriber" && (
        <li className="nav-item ml-auto" id="hide_for_sidenav">
          <Link href="/user">
            <a className="nav-link text-light">{isAuth().name.split(" ")[0]}</a>
          </Link>
        </li>
      )}
      {isAuth() && isAuth().role === "admin" && (
        <li className="nav-item ml-auto" id="hide_for_sidenav">
          <Link href="/admin">
            <a className="nav-link text-light">{isAuth().name.split(" ")[0]}</a>
          </Link>
        </li>
      )}
      {isAuth() && (
        <li className="nav-item" id="hide_for_sidenav">
          <a onClick={logout} className=" btn nav-link text-light">
            Logout
          </a>
        </li>
      )}
    </ul>
  );

  return (
    <>
      <Head>{head()}</Head>
      {nav()}
      <div className="container pt-5 pb-5">
        <div className="container">{children}</div>
      </div>
    </>
  );
};

export default Layout;
