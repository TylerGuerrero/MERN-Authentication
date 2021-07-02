import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const PrivateScreen = () => {
    const [error, setError] = useState("")
    const [privateData, setPrivateData] = useState("")
    const history = useHistory()

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            history.push("/")
        }

        const fetchPrivateData = async () => {
            const config = {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem("authToken")}`
            }

            try {
                const { data } = await axios.get("/api/private", config)
                setPrivateData(data.data)
            } catch (error) {
                localStorage.removeItem("authToken")
                setError("You are not authorizsed please login")
                history.push("/login")
            }
        }

        fetchPrivateData()
    }, [history])

    const logoutHandler = () => {
        localStorage.removeItem("authToken")
        history.push("/login")
    }

    return (
        <div>
            {error ? 
            <span className="error-message"> { error }</span>
            :   <React.Fragment>
                    <div style={{background: "green", color: "white"}}>
                        {privateData}
                    </div>
                    <button onClick={logoutHandler}>Logout</button>
                </React.Fragment>
            }
        </div>
    )
}

export default PrivateScreen
