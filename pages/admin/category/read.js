import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { useState, useEffect } from "react";
import { API } from "../../../config";
import axios from "axios";
import { errorAlert, successAlert } from "../../../alerts";
import Link from "next/link";

const Read = ({ user, token }) => {
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

  const listCategories = () =>
    categories.map((c, i) => (
      <div className="jumbotron p-5 col-md-12" key={i}>
        <Link href={`/links/${c.slug}`}>
          <a>
            <div>
              <div className="row">
                <div className="col-md-3">
                  <img
                    src={c.image && c.image.url}
                    alt={c.title}
                    style={{ width: "80px", height: "auto" }}
                  />
                </div>
                <div className="col-md-8">
                  <h4>{c.title}</h4>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </div>
    ));

  useEffect(() => {
    loadCategories();
  }, []);
  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1>All Categories</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories()}</div>
    </Layout>
  );
};

export default withAdmin(Read);
