import { React, useState } from "react";
import { useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { SlClose } from "react-icons/sl";
import { NavLink } from "react-router-dom";
import { HomePath, LoginPath, RegisterPath, Url } from "./routePaths";
import './Login.css';

// eslint-disable-next-line react/prop-types
export default function Register() {
    const [user, setUser] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();

    // updates the users data 
    function updateUser(value) {
        return setUser((prev) => {
            return { ...prev, ...value };
        });
    }

    // on click of the register button
    async function onSubmit(e) {
        // prevent the page from reloading
        e.preventDefault();

        // create a copy of the user data to send to the backend
        const newUser = { ...user };
        // backend connection to register the user
        await fetch(Url + RegisterPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
            .then(async function (res) {
                // checks to see if the backend has any issues
                if (res.status == 400) {
                    // display the validation messages in an alert
                    await res.json().then(data => alert(data["msg"]));
                }
                else {
                    // reset the user data
                    setUser({ username: '', email: '', password: '', confirmPassword: '' });
                    // send the user to the login page
                    navigate(LoginPath);
                }
            })
            .catch(error => {
                // display the error messages in an alert
                window.alert(error);
                return;
            });
    }

    return (
        <div className="background">
            <div className="form register">
                <div className="form-content">
                    {/* close button */}
                    <NavLink to={HomePath}>
                        <SlClose className="close-register" />
                    </NavLink>
                    <header className="form-header">Register</header>
                    <form onSubmit={onSubmit}>
                        <div className="field input-field">
                            <input type="text" value={user.username} onChange={(e) => updateUser({ username: e.target.value })} placeholder="Username" className="input signup-username" pattern="^(?!.*undefined).*[A-Za-z][A-Za-z0-9_]{4,16}$" title="Username must be 5-16, without the use of special characters." required />
                        </div>
                        <div className="field input-field">
                            <input type="email" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} placeholder="Email" className="input signup-email" required />
                        </div>
                        <div className="field input-field">
                            <input type="password" value={user.password} onChange={(e) => updateUser({ password: e.target.value })} placeholder="Create Password" className="create password" required />
                            <i className="bx bx-hide eye-icon"></i>
                        </div>
                        <div className="field input-field">
                            <input type="password" value={user.confirmPassword} onChange={(e) => updateUser({ confirmPassword: e.target.value })} placeholder="Confirm Password" className="confirm password" required />
                            <i className="bx bx-hide eye-icon"></i>
                        </div>
                        <div className="field button-field register">
                            <button type="submit">Register</button>
                        </div>
                    </form>
                    <div className="form-link">
                        <span>Already have an account?
                            {/* sends the user to the login screen */}
                            <NavLink className="link login-link" to={LoginPath}> Login</NavLink>
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