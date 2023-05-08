import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import styles from '../styles/login.module.css'
import LoginCard from "../src/components/loginCard/loginCard"
import Input from '../src/components/input/input'
import Button from '../src/components/button/button'
import Link from 'next/link'

export default function LoginPage() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const router = useRouter();

    const handleFormEdit = (event, name) => {
        setFormData({
            ...formData,
            [name]: event.target.value
        });
    };

    const handleForm = async (event) => {
        try {
            event.preventDefault();

            const response = await fetch(`/api/user/login`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const json = await response.json();
            if (response.status !== 200) throw new Error(json);

            setCookie('authorization', json);
            router.push('/')

        } catch (err) {
            setError(err.message);
        };
    };

    return (
        <div className={styles.background}>
            <LoginCard title="Entre em sua conta">
                <form onSubmit={handleForm} className={styles.form}>
                    <Input type="email" placeholder="Seu e-mail" required value={formData.email}  onChange={(e) => { handleFormEdit(e, 'email') }} />
                    <Input type="password" placeholder="Sua senha" required value={formData.password} onChange={(e) => { handleFormEdit(e, 'password') }} />
                    <Button>Entrar</Button>
                    {error && <p className={styles.error}>{error}</p>}

                    <Link href="/signup" className={styles.advice}>Ainda não possui conta? Cadastre-se!</Link>
                </form>
            </LoginCard>
        </div>
    )
}