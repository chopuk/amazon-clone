const environments = {
    development: {
        URL_PREFIX: 'http://192.168.0.220:3000',
        ANOTHER_VARIABLE: 'chelsea'
    },
    production: {
        URL_PREFIX: 'https://chops-file-server.onrender.com',
        ANOTHER_VARIABLE: 'liverpool'
    }
}

const env = environments.development // change this line as needed and import environment.js where needed
export default env