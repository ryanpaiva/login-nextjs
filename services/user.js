import jwt from "jsonwebtoken"
import { Client } from "pg"

const SECRET = process.env.JWT_SECRET

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const client = new Client(dbConfig);

async function connect() {
    try {
        await client.connect();
        console.log('Conexão com o banco de dados estabelecida.');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

connect();

function createToken(user) {
    return jwt.sign({ email: user.email, name: user.name }, SECRET)
}

function readToken(token) {
    try {
        return jwt.verify(token, SECRET)
    } catch (err) {
        throw new Error('Token inválido')
    }
}

export function tokenVerify(token) {
    return readToken(token)
}

export async function login(body) {
    try {
        const query = 'SELECT * FROM users WHERE email = $1'
        const values = [body.email]

        const result = await client.query(query, values)

        if (result.rows.length === 0) {
            throw new Error('Usuário não cadastrado.')
        }

        const user = result.rows[0]

        if (user.password !== body.password){
            throw new Error('Senha Incorreta')
        }

        const token = createToken(user)
        return token

    } catch (err) {
        console.error('Erro ao efetuar Login:', err);
        throw new Error('Erro ao efetuar Login.', err)
    }
}

export async function signup(body) {
    try {
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkValues = [body.email];
        const checkResult = await client.query(checkQuery, checkValues);

        if (checkResult.rows.length > 0) {
            throw new Error('Email já cadastrado.');
        }

        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
        const values = [body.username, body.email, body.password];

        await client.query(query, values);

        const token = createToken(body);
        return token
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        throw new Error('Erro ao cadastrar usuário.', err);
    }
}