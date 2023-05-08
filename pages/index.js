import { getCookie } from 'cookies-next'
import { tokenVerify } from '../services/user'

export default function Home() {
  return (
    <div>
      Página segura
    </div>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  try {
    const token = getCookie('authorization', { req, res });
    if(!token) throw new Error('Token Inválido')

    tokenVerify(token)
    return {
      props: {}
    }

  } catch (err) {

    return {
      redirect: {
        permanent: false,
        destination: '/login'
      },
      props: {}
    }

  };
};