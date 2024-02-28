import { React, useState, useEffect } from "react";
import styled from "styled-components";
import logo from "./logo-no-background.png";
import { HomePath, LoginPath, RegisterPath } from './routePaths';
import "./Header.css"
import { NavLink } from "react-router-dom";
import { RiSearchLine } from 'react-icons/ri';
import { BsJournalPlus } from "react-icons/bs";
import { BsBookmarkHeart } from "react-icons/bs";

// eslint-disable-next-line react/prop-types
export default function Header({ userData }) {
    const [userRef, setUserRef] = useState({
        token: undefined,
        user: undefined,
    });
    useEffect(() => {
        setUserRef(userData);
        console.log("refreshing");
    }, [userData]);
    // eslint-disable-next-line react/prop-types
    console.log(userRef);

    function logout() {
        localStorage.setItem("auth-token", "");
    }
    return (
        <header className="header flex-row">
            <div className="header-left">
                {userRef.user != undefined ?
                    <div>
                        <h3 className="welcome">Welcome {userRef.user.username}</h3>
                        <NavLink className="nav-link" to={HomePath}>
                            <Button type="button" onClick={logout}>Signout</Button>
                        </NavLink>
                    </div>
                    :
                    <div>
                        <NavLink className="nav-link" to={LoginPath}>
                            <Button type="button">Login</Button>
                        </NavLink>
                        or
                        <NavLink className="nav-link" to={RegisterPath}>
                            <Button theme="blue" type="button">Register</Button>
                        </NavLink>
                    </div>}
            </div>
            <div className="header-center">
                <NavLink className="nav-link" to="/">
                    <img src={logo} className="logo" name="flavorverse logo"></img>
                </NavLink>
            </div>
            <div className="header-right">
                <input type="text" placeholder="Search Recipe..." name="search" />
                <RiSearchLine className="search-icon" style={{ height: '2em', width: '2em' }} />
                {userRef.user != undefined ?
                    <div className="logged-in-icons">
                        <button><BsBookmarkHeart size={24}></BsBookmarkHeart></button>
                        <button><BsJournalPlus size={24}></BsJournalPlus></button>
                    </div>
                    : null
                }
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
