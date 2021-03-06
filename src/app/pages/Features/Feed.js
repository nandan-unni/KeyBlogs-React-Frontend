import React, { Component } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

import { Menu, Dropdown, Row, Popover } from "antd";

import "./Feed.css";
import { Logo, Navbar, Footer, Stud, AccountCard } from "../../components";
import { likeBlogAPI, saveBlogAPI, feedAPI } from "../../../services/blog";
import { ellipsis } from "../../../utils";
import { routes } from "../../router/routes";
import { writerImg } from "../../../static";

function Skltn() {
  return (
    <div className="Sk">
      <Skeleton height={"3.5vh"} width={"20vw"} />
      <br />
      <Skeleton height={"2vh"} width={"10vw"} />
      <br />
      <br />
      <Skeleton height={"3vh"} width={"80vw"} />
      <br />
      <Skeleton height={"3vh"} width={"80vw"} />
      <br />
      <Skeleton height={"3vh"} width={"80vw"} />
      <br />
      <Skeleton height={"3vh"} width={"80vw"} />
      <br />
      <Skeleton height={"3vh"} width={"80vw"} />
      <br />
      <br />
      <div className="Sk-Nav">
        <div className="Sk-left">
          <Skeleton height={"5vh"} width={"7.5vh"} />
          <Skeleton circle={true} height={"5vh"} width={"5vh"} />
        </div>
        <div className="Sk-right">
          <Skeleton circle={true} height={"5vh"} width={"5vh"} />
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      blogs: [],
      loaded: false,
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    feedAPI().then((result) => {
      this.setState({ blogs: result, loaded: true });
    });
    document.addEventListener("scroll", () => {
      var navbar = document.getElementById("Navbar");
      var sticky = navbar.offsetTop;
      try {
        if (window.pageYOffset > sticky) {
          navbar.classList.add("Navbar-fixed");
        } else {
          navbar.classList.remove("Navbar-fixed");
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  handleLike = async (pk) => {
    const res = await likeBlogAPI(pk, this.state.user.pk);
    this.setState({ blogs: res.data });
  };
  handleSave = async (pk) => {
    const res = await saveBlogAPI(pk, this.state.user.pk);
    this.setState({ blogs: res.data });
  };
  render() {
    const user = this.state.user;
    return (
      <div
        className="Feed"
        onScroll={() => {
          console.log("scrolling");
        }}
      >
        <Logo />
        <Navbar api createBlog search profile logout />

        <div className="Blogs">
          {this.state.loaded ? (
            this.state.blogs.map((blog) => (
              <div className="Blog" key={blog.pk}>
                <div className="Blog-Head">
                  <div className="Blog-Head-left">
                    <img
                      src={blog.author.dp}
                      onError={(e) => (e.target.src = writerImg)}
                      alt="dp"
                    />
                    <span>
                      <h3>{blog.title}</h3>
                      <Popover
                        content={
                          <AccountCard
                            img={blog.author.dp}
                            username={blog.author.username}
                            name={blog.author.name}
                          />
                        }
                        style={{ padding: 0 }}
                      >
                        <Link to={routes.VIEW_WRITER(blog.author.username)}>
                          {blog.author.username}
                        </Link>
                      </Popover>
                    </span>
                  </div>
                  <div className="Blog-Head-right">
                    {blog.author.username === user.username ? (
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item>
                              <Link to={routes.VIEW_BLOG(blog.pk)}>
                                <Row align="middle">
                                  <FeatherIcon
                                    icon="eye"
                                    size={15}
                                    style={{ marginRight: "5px" }}
                                  />
                                  View Blog
                                </Row>
                              </Link>
                            </Menu.Item>
                            <Menu.Item>
                              <Link to={routes.EDIT_BLOG(blog.pk)}>
                                <Row align="middle">
                                  <FeatherIcon
                                    icon="edit-2"
                                    size={15}
                                    style={{ marginRight: "5px" }}
                                  />
                                  Edit Blog
                                </Row>
                              </Link>
                            </Menu.Item>
                            <Menu.Item>
                              <Link to={routes.DELETE_BLOG(blog.pk)}>
                                <Row align="middle">
                                  <FeatherIcon
                                    icon="trash-2"
                                    size={15}
                                    style={{ marginRight: "5px" }}
                                  />
                                  Delete Blog
                                </Row>
                              </Link>
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <FeatherIcon icon="more-vertical" />
                      </Dropdown>
                    ) : (
                      <Link to={routes.VIEW_BLOG(blog.pk)}>
                        <button className="Blog-Read">Read</button>
                      </Link>
                    )}
                  </div>
                </div>
                <div
                  className="Blog-Body"
                  // dangerouslySetInnerHTML={{ __html: blog.content }}
                >
                  {window.screen.width > 600 ? (
                    <p>{ellipsis(blog.summary, 600)}</p>
                  ) : (
                    <p>{ellipsis(blog.summary, 300)}</p>
                  )}
                </div>
                <div className="Blog-Nav">
                  <div onClick={() => this.handleLike(blog.pk)}>
                    <Stud
                      type="Like"
                      icon="favorite"
                      theme="#ff6347"
                      count={blog.no_of_likes}
                      active={blog.likes.some(
                        (like) => like.username === user.username
                      )}
                    />
                  </div>
                  <div onClick={() => this.handleSave(blog.pk)}>
                    <Stud
                      type="Save"
                      icon="bookmark"
                      theme="#1e90ff"
                      active={blog.saves.some(
                        (like) => like.username === user.username
                      )}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <Skltn />
              <Skltn />
            </>
          )}
        </div>
        <br />
        <br />
        <hr />
        <Footer />
      </div>
    );
  }
}

export default Feed;
