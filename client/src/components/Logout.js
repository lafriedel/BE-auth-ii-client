import React from "react";

const Logout = props => {

  return (
    <>
      <button onClick={e => props.logout(e)}>Logout</button>
    </>
  );
};

export default Logout;
