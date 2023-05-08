import styles from '../styles/login.module.css'
import LoginCard from "../src/components/loginCard/loginCard"
import Input from '../src/components/input/input'
import Button from '../src/components/button/button'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className={styles.background}>
            <LoginCard title="Entre em sua conta">
                <form className={styles.form}>
                    <Input type="email" placeholder="Seu e-mail" />
                    <Input type="password" placeholder="Sua senha" />
                    <Button>Entrar</Button>

                    <Link href="/signup">Ainda não possui conta? Cadastre-se!</Link>
                </form>
            </LoginCard>
        </div>
    )
}