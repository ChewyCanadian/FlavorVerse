import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { SlClose } from "react-icons/sl";
import { NavLink } from "react-router-dom";
import { HomePath, LoginPath, RegisterPath, Url } from "./routePaths";
import "./Login.css"

// eslint-disable-next-line react/prop-types
export default function Login({ updateReload }) {
    const [user, setUser] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    function updateUser(value) {
        return setUser((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        // creates a copy of the user data
        const loginUser = { ...user };

        // database communication to login the user
        await fetch(Url + LoginPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginUser),
        })
            .then(async function (res) {
                // checks if the backend has any issues
                if (res.status == 400) {
                    await res.json().then(data => alert(data["msg"]));
                }
                else {
                    // get the response data from the backend
                    await res.json().then(function (data) {
                        // fill the local storage with the users auth token
                        localStorage.setItem("auth-token", data.token);
                        setUser({ email: '', password: '' });
                        // navigate back to home on successful login
                        updateReload(true);
                        navigate(HomePath);
                    });
                }
            })
            .catch(error => {
                window.alert(error);
                return;
            });

    }

    return (
        <div className="background">
            <div className="form login">
                <div className="form-content">
                    <NavLink className="nav-link" to={HomePath}>
                        <SlClose className="close-login" />
                    </NavLink>
                    <header className="form-header ">Login</header>
                    <form onSubmit={onSubmit}>
                        <div className="field input-field">
                            <input type="email" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} placeholder="Email" className="input email" required />
                        </div>
                        <div className="field input-field">
                            <input type="password" value={user.password} onChange={(e) => updateUser({ password: e.target.value })} placeholder="Password" className="input password" required />
                            <i className="bx bx-hide eye-icon"></i>
                        </div>
                        <div className="form-link">
                            <a href="#" className="forgot-pass">Forgot password?</a>
                        </div>
                        <div className="field button-field login">
                            <button type="submit">Login</button>
                        </div>
                    </form>
                    <div className="form-link">
                        <span>
                            Dont have an account?
                            {/* sends the user to the register page */}
                            <NavLink className="link signup-link" to={RegisterPath}> Signup</NavLink>
                        </span>
                    </div>
                </div>
                <div className="line"></div>
                <div className="media-options">
                    <a href="#" className="field google">
                        <FcGoogle style={{ height: '20px', width: '20px', objectFit: 'cover' }} />
                        <span>Login with Google</span>
                    </a>
                </div>
            </div>
        </div>
    );
}