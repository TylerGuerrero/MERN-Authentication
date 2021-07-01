import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'

import './LoginScreen.css'

const LoginScreen = () => {
    const [formInputs, setFormInputs] = useState({ email: "", password: "", confirmPassword: ""})
    const [error, setError] = useState("")
    const history = useHistory()

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/")
        }
    }, [history])

    const handleChange = (e) => {
        setFormInputs({...formInputs, [e.target.name]: e.target.value})
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault()

        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }

        if (formInputs.password !== formInputs.confirmPassword) {
            setFormInputs({ ...formInputs, password: "", confirmPassword: ""})
            setTimeout(() => {
                setError("")
            }, 5000)
            return setError("Passwords do not match")
        }

        try {
            const { data } = await axios.post("/api/auth/login", formInputs, config)
            localStorage.setItem("authToken", JSON.stringify(data.token))
            history.push("/")
        } catch (error) {
            setError(error.response.data.error)
            setTimeout(() => {
                setError("")
            }, 5000)
        }
    }

    return (
        <div className="login-screen">
            <form className="login-screen__form" onSubmit={handleLoginSubmit}>
                <h3 className="login-screen__title">Login</h3>
                { error && <span className="error-message"> { error } </span>} 
                <div className="form-group">
                    <label htmlFor="email">Email: </label>
                    <input 
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="Enter Email"
                    value={formInputs.email}
                    onChange={(e) => handleChange(e)}
                    />
                </div>  
                <div className="form-group">
                    <label htmlFor="password">Password: </label>
                    <input 
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter Password"
                    value={formInputs.password}
                    onChange={(e) => handleChange(e)}
                    />
                </div>  
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password: </label>
                    <input
                    type="password"
                    id="confirmPassword"
                    required
                    placeholder="Re-Write Password"
                    name="confirmedPassword"
                    value={formInputs.confirmPassword}
                    onChange={(e) => handleChange(e)}
                    />
                </div>  
                <button type="submit" className="btn btn-primary">Login</button>
                <span className="login-screen__subtext">
                    Don't Have An Account Yet ? <Link to="/register">Register</Link>
                </span>
            </form>
        </div>
    )
}

export default LoginScreen
