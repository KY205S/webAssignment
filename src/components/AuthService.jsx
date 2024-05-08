class AuthService {
    static getToken() {
        return sessionStorage.getItem('jwtToken');
    }

    static setToken(token) {
        sessionStorage.setItem('jwtToken', token);
    }

    static clearToken() {
        sessionStorage.removeItem('jwtToken');
    }

    static makeAuthRequest(url, options = {}) {
        const headers = new Headers(options.headers || {});
        headers.append('Authorization', 'Bearer ' + AuthService.getToken());

        const fetchOptions = {
            ...options,
            headers
        };

        return fetch(url, fetchOptions);
    }
}

export default AuthService;