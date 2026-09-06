import { Link } from "react-router-dom";

function AuthForm({ mode }) {
    const isLogin = mode === 'login';
    const buttonText = isLogin ? 'Log In' : 'Sign Up';
    const helperText = isLogin ? "Don't have an account? " : "Already have an account? ";
    const linkText = isLogin ? 'Create an Account' : 'Log In';
    const targetUrl = isLogin ? '/signup' : '/login';

    return (
        <form method="POST">
            <label>
                Email:
                <input type="email" name="email" required></input>
            </label>
            <label>
                Password:
                <input type="password" name="password" required></input>
            </label>
            <button>{buttonText}</button>
            <span>{helperText}</span>
            <Link to={targetUrl}>
                {linkText}
            </Link>
        </form>
    )
}


export default AuthForm;