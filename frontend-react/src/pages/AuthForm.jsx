function AuthForm() {
    return (
        <>
            <section className="">
                <form action="POST">
                    <label htmlFor="">Email</label>
                    <input type="email" />
                </form>
            </section>
        </>
    )
}

export default AuthForm;