import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
    const { input } = useParams(); // This now contains userId

    useEffect(() => {
        if (input) {
            setUserId(input);
        } else {
            // If no userId parameter, redirect back to forgot password
            navigate('/forgot-password');
        }
    }, [input, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError("Please fill in both fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!userId) {
            setError("User ID is missing. Please try again.");
            return;
        }

        try {
            const resetData = {
                userId: userId,
                newPassword: password
            };

            await resetPassword(resetData);
            navigate("/login");
        } catch (error) {
            console.error("Error resetting password:", error);
            setError("Failed to reset password. Please try again.");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <p>Create a new password for your account</p>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;