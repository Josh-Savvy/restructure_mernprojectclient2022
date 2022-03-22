import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { API } from "../config";
// import renderHtml from "react-render-html";

const Home = ({ categories }) => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trendingLinks, setTrendingLinks] = useState([]);

  const runSearch = () => {
    const filteredData = categories.filter((category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCategoriesList(filteredData);
  };

  useEffect(() => {
    runSearch();
  }, [searchTerm]);

  const loadTrendingLinks = async () => {
    const response = await axios.get(`${API}/links/trending`);
    setTrendingLinks(response.data);
  };

  useEffect(() => {
    loadTrendingLinks();
  }, []);

  const handleClick = async (e, linkId) => {
    await axios.put(`${API}/click-count`, { linkId });
    loadTrendingLinks();
  };

  const listCategories = () =>
    categoriesList.map((c, i) => (
      <div
        key={i}
        className="rounded bg-light p-3 col-md-11 mb-3"
        style={{
          boxShadow: "0 1px 3px rgb(23 23 23 / 24%)",
          cursor: "pointer",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgb(23 23 23 / 25%)",
        }}
      >
        <Link href={`/links/${c.slug}`}>
          <div>
            <div className="row">
              <div className="col-5" style={{ maxHeight: "90px" }}>
                <img
                  src={c.image && c.image.url}
                  alt="image not available"
                  style={{ width: "55%", height: "100%" }}
                />
              </div>
              <div className="col-5 mt-3">
                <h3 style={{ color: "dodgerblue" }}>{c.title}</h3>
              </div>
              {/* <div className="p-3 text-dark">
                <p>{renderHtml(c.content.substr(0, 90))}...</p>
              </div> */}
            </div>
          </div>
        </Link>
      </div>
    ));

  const listOfLinks = () =>
    trendingLinks.map((l, i) => (
      <>
        <div
          className="alert bg-light"
          key={i}
          style={{ boxShadow: "0 4px 12px rgb(23 23 23 / 25%)" }}
        >
          <a
            href={l.url}
            target="_blank"
            className="text-primary"
            onClick={() => handleClick(l._id)}
          >
            <div>{l.title}</div>
          </a>
          <div
            className="text-danger"
            style={{ position: "relative", left: "1%" }}
          >
            <span style={{ fontSize: "13px" }}>
              {moment(l.createdAt).fromNow()} by {l.postedBy.name}
            </span>
          </div>
          <div className="row">
            <div className="col-6">
              {l.clicks}{" "}
              {(l.clicks === 0 && "views") ||
                (l.clicks === 1 && "view") ||
                (l.clicks > 1 && "views")}
            </div>
            <div className="col-6">
              <div className="row pt-1">
                <div className="col-12 badge text-success">
                  {l.type} {l.medium}
                </div>
              </div>
            </div>
            <div className="">
              {l.categories.map((c, i) => (
                <div className="badge text-secondary" key={i}>
                  {c.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    ));
  return (
    <Layout>
      <div className="text-center">
        {/* <div className="search-box text-center">
          <input
            id="search"
            className="form-control float-right"
            style={{ width: "25%" }}
            type="text"
            placeholder="Search Tutorials"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
      </div>
      <div className="row">
        <br />
        <div className="col-md-8">
          <h1 className="font-weight-bold">Browse Tutorials</h1>
          <br />
          <div className="row">{listCategories()}</div>
        </div>
        <div className="col-md-4 pt-2" id="trendingLinksContainer">
          <h4 className="text-center pb-1">Featured links</h4>
          <div className="">{listOfLinks()}</div>
        </div>
      </div>
    </Layout>
  );
};

Home.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);

  return {
    categories: response.data,
  };
};

export default Home;
