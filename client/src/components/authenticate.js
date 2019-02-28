import React from "react";
import { Route } from "react-router";
import axios from "axios";
import FormView from "./FormView";
import UserList from "./UserList";

axios.interceptors.request.use(
  function(options) {
    options.headers.authorization = localStorage.getItem("token");

    return options;
  }
)

const authenticate = UserList => FormView =>
  class extends React.Component {
    state = {
      userRegistered: false,
      userLoggedIn: false,
      user: {
        username: "",
        password: "",
        department: ""
      }
    };

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token && token !== "") {
            this.setState({
                ...this.state,
                userLoggedIn: true
            })
            this.props.history.push("/users");
        } else {
            this.props.history.push("/login");
        }
    }

    formChange = e => {
      this.setState({
        ...this.state,
        user: {
          ...this.state.user,
          [e.target.name]: e.target.value
        }
      });
    };

    login = e => {
      e.preventDefault();
      axios
        .post("http://localhost:8000/api/login", this.state.user)
        .then(res => {
          localStorage.setItem("token", res.data.token);
          this.setState({
            ...this.state,
            userRegistered: false,
            user: {
              username: res.data.user.username,
              password: "",
              department: res.data.user.department
            }
          });
          this.props.history.push("/users")
        })
        .catch(err => console.log(err));
    };

    register = e => {
        e.preventDefault();
        axios
            .post("http://localhost:8000/api/register", this.state.user)
            .then(res => {
                this.setState({
                    ...this.state,
                    userRegistered: true,
                    user: {
                        username: "",
                        department: "",
                        password: ""
                    }
                });
                this.props.history.push("/login");
            })
            .catch(err => console.log(err));
    }

    logout = e => {
      e.preventDefault();
      localStorage.removeItem("token");
      this.setState({
        ...this.state,
        user: {
          username: "",
          password: "",
          department: ""
        }
      });
      this.props.history.push("/login");
    }

    render() {
      const token = localStorage.getItem("token");
      return token ? (
        <Route
          path="/users"
          render={props => (
            <UserList {...props} user={this.state.user} logout={this.logout} />
          )}
        />
      ) : (
        <FormView
          history={this.props.history}
          user={this.state.user}
          formChange={this.formChange}
          login={this.login}
          register={this.register}
          userRegistered={this.state.userRegistered}
        />
      );
    }
  };

export default authenticate(UserList)(FormView);
