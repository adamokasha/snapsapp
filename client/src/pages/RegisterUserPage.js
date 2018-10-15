import React from "react";
import DisplayNameForm from "../components/DisplayNameForm";
import NavBar from "../components/NavBar";

export class RegisterUser extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <DisplayNameForm onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default RegisterUser;
