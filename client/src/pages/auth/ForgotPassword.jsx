import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue) {
            setError("Please enter your email or contact number");
            return;
        }

        // Determine if it's email or contact number
        const isEmail = inputValue.includes('@');
        const payload = isEmail ? { email: inputValue } : { contact_no: inputValue };

        try {
            await forgotPassword(payload);
            // Encode the input value to handle special characters in email
            const encodedInput = encodeURIComponent(inputValue);
            navigate(`/verify-user/${encodedInput}`);
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Failed to send reset OTP. Please try again.');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your email or contact number"
                />
                <button type="submit">Send OTP</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
