import React from "react";
import axios from "axios";
import Logout from "./Logout";

class UserList extends React.Component {
  state = {
    users: []
  };

  componentDidMount() {
    axios.get("https://auth-ii-db.herokuapp.com//api/users").then(res => {
      console.log(res.data);
      this.setState({
        users: res.data.filter(u => u.department === this.props.user.department)
      });
    });
  }
  render() {
    return (
      <>
        <h1>Users</h1>
        {this.state.users.map(user => (
          <div className="user-info" key={user.id}>
            <p>Username: {user.username}</p>
            <p>Department: {user.department}</p>
          </div>
        ))}
        <Logout history={this.props.history} logout={this.props.logout} />
      </>
    );
  }
}

export default UserList;
