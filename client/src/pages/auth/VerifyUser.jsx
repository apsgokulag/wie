import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { verifyUser } from "../../services/authService";

const VerifyUser = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [userInput, setUserInput] = useState("");
    const [inputType, setInputType] = useState(""); // To show what type of input it is
    const navigate = useNavigate();
    const { input } = useParams(); // Get the input parameter from URL

    useEffect(() => {
        if (input) {
            const decodedInput = decodeURIComponent(input);
            setUserInput(decodedInput);
            
            // Determine if it's email or contact number
            const isEmail = decodedInput.includes('@');
            setInputType(isEmail ? 'email' : 'contact number');
        } else {
            // If no input parameter, redirect back to forgot password
            navigate('/forgot-password');
        }
    }, [input, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError("Please enter the OTP");
            return;
        }

        if (!userInput) {
            setError("User input is missing. Please try again.");
            return;
        }

        try {
            // Create the input object based on whether it's email or contact_no
            const isEmail = userInput.includes('@');
            const inputData = {
                input: isEmail ? { email: userInput } : { contact_no: userInput },
                otp: otp
            };

            const response = await verifyUser(inputData);
            // Pass the userId to reset password page
            navigate(`/reset-password/${response.userId}`);
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setError("Failed to verify OTP. Please try again.");
        }
    };

    return (
        <div>
            <h2>Verify User</h2>
            <p>Enter the OTP sent to your {inputType}: {userInput}</p>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={6} // Assuming OTP is 6 digits
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default VerifyUser;