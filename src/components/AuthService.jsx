// class AuthService {
//     static getToken() {
//         return sessionStorage.getItem('jwtToken');
//     }
//
//     static setToken(token) {
//         sessionStorage.setItem('jwtToken', token);
//     }
//
//     static clearToken() {
//         sessionStorage.removeItem('jwtToken');
//     }
//
//
//     static makeAuthRequest(url, options = {}) {
//         const headers = new Headers(options.headers || {});
//         headers.append('Authorization', 'Bearer ' + AuthService.getToken());
//
//         const fetchOptions = {
//             ...options,
//             headers
//         };
//
//         return fetch(url, fetchOptions);
//     }
// }
//
// export default AuthService;

class AuthService {
    static getToken() {
        // 使用 localStorage 来持久化 token
        return localStorage.getItem('jwtToken');
    }

    static setToken(token) {
        // 在 localStorage 中存储 token
        localStorage.setItem('jwtToken', token);
    }

    static clearToken() {
        // 从 localStorage 中移除 token
        localStorage.removeItem('jwtToken');
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
