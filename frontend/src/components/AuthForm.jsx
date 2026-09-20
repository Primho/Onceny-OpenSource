import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../api";

function AuthForm({ mode }) {
    const isLogin = mode === 'login';
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const buttonText = isLogin ? 'Log In' : 'Sign Up';
    const helperText = isLogin ? "Don't have an account? " : "Already have an account? ";
    const linkText = isLogin ? 'Create an Account' : 'Log In';
    const targetUrl = isLogin ? '/signup' : '/login';

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await login({ email: formData.email, password: formData.password });
            } else {
                await signup(formData);
            }
            navigate('/app');
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form method="POST" className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__header">
                <p className="auth-form__eyebrow">Welcome to Onceny</p>
                <h2 className="auth-form__title">{buttonText}</h2>
                <p className="auth-form__description">
                    {isLogin ? 'Continue where you left off.' : 'Create your account to get started.'}
                </p>
            </div>

            <div className="auth-form__fields">
                {!isLogin && (
                    <div className="auth-form__field">
                        <label className="auth-form__label" htmlFor="auth-username">Username</label>
                        <input
                            className="auth-form__input"
                            id="auth-username"
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="auth-email">Email address</label>
                    <input
                        className="auth-form__input"
                        id="auth-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="auth-password">Password</label>
                    <input
                        className="auth-form__input"
                        id="auth-password"
                        type="password"
                        name="password"
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {error && <p className="auth-form__error" role="alert">{error}</p>}

            <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : buttonText}
            </button>

            <p className="auth-form__switch">
                <span>{helperText}</span>
                <Link className="auth-form__link" to={targetUrl}>
                    {linkText}
                </Link>
            </p>
        </form>
    )
}


export default AuthForm;