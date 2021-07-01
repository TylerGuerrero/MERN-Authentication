import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'

import './RegisterScreen.css'

const RegisterScreen = () => {
    const [formInputs, setFormInputs] = useState({ email: "", password: "", name: "", confirmPassword: ""})
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

    const handleRegisterSubmit = async (e) => {
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
            const { data } = await axios.post("/api/auth/register", formInputs, config)
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
        <div className="register-screen">
            <form className="register-screen__form" onSubmit={handleRegisterSubmit}>
                <h3 className="register-screen__title">Register</h3>
                { error && <span className="error-message"> { error } </span>}
                <div className="form-group">
                    <label htmlFor="name">Username: </label>
                    <input 
                    id="name" 
                    type="text"
                    required
                    name="name"
                    placeholder="Enter Name"
                    value={formInputs.name}
                    onChange={(e) => handleChange(e)}
                    />
                </div>  
                <div className="form-group">
                    <label htmlFor="email">Email: </label>
                    <input 
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="Enter email"
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
                    name="confirmedPassword"
                    value={formInputs.confirmPassword}
                    onChange={(e) => handleChange(e)}
                    />
                </div>  
                <button type="submit" className="btn btn-primary">Register</button>
                <span className="register-screen__subtext">
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
        </div>
    )
}

export default RegisterScreen
