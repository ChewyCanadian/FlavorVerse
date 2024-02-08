import React from "react";
import styled from "styled-components";
import logo from "./logo-no-background.png"
import "./Header.css"
import { RiSearchLine } from 'react-icons/ri';

function Header() {
    return (
        <header className="header flex-row">
            <div className="header-left">
                <Button type="button">Login</Button>
                or
                <Button theme="blue" type="button">Register</Button>
            </div>
            <div className="header-center">
                {/* <a href="#default" className="logo">FlavorVerse</a> */}
                <img src={logo} className="logo" name="flavorverse logo"></img>
            </div>
            <div className="header-right">
                <input type="text" placeholder="Search Recipe..." name="search" />
                <RiSearchLine className="search-icon" style={{ height: '2em', width: '2em' }} />
            </div>
        </header >
    );
}

const theme = {
    grey: {
        default: "#95a5a6",
        hover: "#7f8c8d",
    },
    blue: {
        default: "#3498db",
        hover: "#2980b9",
    },
};

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  border: 0; 
  text-transform: uppercase;
  margin: 10px 5px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

Button.defaultProps = {
    theme: "grey",
};

export default Header;
