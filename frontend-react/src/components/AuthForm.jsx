import { Link } from "react-router-dom";

function AuthForm({ mode }) {
    const isLogin = mode === 'login';
    const buttonText = isLogin ? 'Log In' : 'Sign Up';
    const helperText = isLogin ? "Don't have an account? " : "Already have an account? ";
    const linkText = isLogin ? 'Create an Account' : 'Log In';
    const targetUrl = isLogin ? '/signup' : '/login';

    return (
        <form method="POST" className="auth-form">
            <div className="auth-form__header">
                <p className="auth-form__eyebrow">Welcome to Onceny</p>
                <h2 className="auth-form__title">{buttonText}</h2>
                <p className="auth-form__description">
                    {isLogin ? 'Continue where you left off.' : 'Create your account to get started.'}
                </p>
            </div>

            <div className="auth-form__fields">
                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="auth-email">Email address</label>
                    <input
                        className="auth-form__input"
                        id="auth-email"
                        type="email"
                        name="email"
                        autoComplete="email"
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
                        required
                    />
                </div>
            </div>

            <button className="auth-form__submit" type="submit">{buttonText}</button>

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