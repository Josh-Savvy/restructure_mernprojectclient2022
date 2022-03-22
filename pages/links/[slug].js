import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { API, APP_NAME } from "../../config";
import renderHtml from "react-render-html";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import Head from "next/head";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linkSkip,
  linksLimit,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);
  const [trendingLinks, setTrendingLinks] = useState([]);

  const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");

  const headTag = () => (
    <Head>
      <>
        <title>
          {APP_NAME} | {category.title}
        </title>
        <meta
          name="description"
          content={stripHTML(category.content.substr(0, 157)) + "..."}
        />
        <meta name="og:title" content={category.title} />
        <meta
          name="og:description"
          content={stripHTML(category.content.substr(0, 157)) + "..."}
        />
        <meta name="og:image" content={category.image.url} />
        <meta name="og:image:secure_url" content={category.image.url} />
      </>
    </Head>
  );

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const loadTrendingLinks = async () => {
    const response = await axios.get(`${API}/links/trending`);
    setTrendingLinks(response.data);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
    loadTrendingLinks(response.data);
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div className="row alert alert-primary p-2" key={i}>
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5>{l.title}</h5>
            <h6 style={{ fontSize: "12px" }} className="text-danger pt-2">
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="float-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
          <span className="text-secondary badge pull-right">
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
    const response = axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...(await response).data.links]);
    setSize((await response).data.links.length);
    setSkip(toSkip);
  };

  useEffect(() => {
    loadTrendingLinks();
  }, []);

  const listTrendingList = () =>
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
    <>
      {headTag()}
      <Layout>
        <div className="row">
          <div className="col-md-8">
            <br />
            <h1 className="font-weight-bold display-5 pb-2">
              {category.title} - URL/Links
            </h1>
            <div className="lead jumbotron pt-4">
              {renderHtml(category.content || "")}
            </div>
          </div>

          <div className="col-md-4">
            <img
              src={category.image.url}
              alt={category.title}
              style={{
                width: "auto",
                maxHeight: "200px",
                marginTop: "90px",
              }}
              className="rounded"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <p>Related Links</p>
            {listOfLinks()}
          </div>
          <div className="col-md-4">
            <h2 className="lead">Most Popular in {category.title}</h2>
            <div>{listTrendingList()}</div>
          </div>
        </div>
        {/* <div className="text-center pt-4 pb-5">{loadMoreBtn()}</div> */}
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
                    style={{ width: "auto", height: "150px" }}
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
Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 1;
  const response = axios.post(`${API}/category/${query.slug}`, { skip, limit });
  return {
    query,
    category: (await response).data.category,
    links: (await response).data.links,
    totalLinks: (await response).data.links.length,
    linksLimit: limit,
    linkSkip: skip,
  };
};
export default Links;
