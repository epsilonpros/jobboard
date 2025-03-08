import axios, {AxiosRequestConfig} from "axios";

export const url = import.meta.env.VITE_API_URL;

export class ApiErrors {
    constructor(public errors: object[]) {
    }
}

class ToSingleTon {
    private static instance: ToSingleTon;

    public static get getInstance() {
        this.instance = this.instance ? this.instance : new this()
        return this.instance;
    }

    private _page: number = 0;

    get page(): number {
        return this._page;
    }

    set page(value: number) {
        this._page = value;
    }

    private _rowsPerPage: number = 5;

    get rowsPerPage(): number {
        return this._rowsPerPage;
    }

    set rowsPerPage(value: number) {
        this._rowsPerPage = value;
    }

    private _search: Search = null;

    get search(): Search {
        return this._search;
    }

    set search(value: Search) {
        this._search = value;
    }
}

export class ApiGeneric {
    private _headers: any = {
        Accept: "application/ld+json",
        withCredentials: true,
    };
    private singleton: ToSingleTon = ToSingleTon.getInstance;

    constructor() {
        this.updateAuthHeader();
    }

    private updateAuthHeader() {
        const token = sessionStorage.getItem("tia-wfs-token");
        if (token) {
            this._headers.Authorization = "Bearer " + token;
        } else {
            delete this._headers.Authorization;
        }
    }

    get page(): number {
        return this.singleton.page;
    }

    set page(value: number) {
        this.singleton.page = value;
    }

    get rowsPerPage(): number {
        return this.singleton.rowsPerPage;
    }

    set rowsPerPage(value: number) {
        this.singleton.rowsPerPage = value;
    }

    get search(): Search {
        return this.singleton.search;
    }

    set search(value: Search) {
        this.singleton.search = value;
    }

    async onSend(endpoint: string, options: AxiosRequestConfig = {}) {
        // Update auth header before each request
        this.updateAuthHeader();

        if (options?.headers) {
            this._headers = {
                ...this._headers,
                ...options.headers
            }
        }

        options = {
            url: url + endpoint,
            ...options,
            headers: this._headers,
        };

        if (
            options.data !== null &&
            typeof options.data === "object" &&
            !(options.data instanceof FormData)
        ) {
            options.data = JSON.stringify(options.data);
            // @ts-ignore
            if (!options.headers["Content-Type"]) {
                // @ts-ignore
                options.headers["Content-Type"] = "application/ld+json";
            }
        } else {
            // @ts-ignore
            options.headers["Content-Type"] = "multipart/form-data";
        }

        try {
            const response = await axios(options);

            if (response?.status === 204) {
                return null;
            }

            if (response?.ok || response?.status === 200 || response?.status === 201) {
                return response.data;
            }
        } catch (error: any) {
            const response = Object.assign({}, error).response;

            // Handle token expiration
            if (response?.status === 401 && response?.data?.errors?.message === "Expired JWT Token") {
                // Clear expired token
                sessionStorage.removeItem("tia-wfs-token");

                // Redirect to login if not already there
                if (!window.location.pathname.includes('/sign-in')) {
                    window.location.href = '/sign-in';
                }

                throw new ApiErrors([{message: "Session expirée, veuillez vous reconnecter"}]);
            }

            if (response?.data) {
                throw new ApiErrors(response.data);
            }

            throw new ApiErrors([{message: "Une erreur est survenue"}]);
        }
    }

    addToUrl(url: string) {
        let urlIn = url;
        if (urlIn.includes("?")) {
            urlIn += "&";
        } else {
            urlIn += "?";
        }
        return urlIn;
    }

    async getPaginate(action: string, type: string) {
        const { page, rowsPerPage, search } = this.singleton;
        const url = action;

        const params = new URLSearchParams();
        if (type === "row_per_page") {
            params.append("limit", String(rowsPerPage));
            params.append("page", "1");
        } else if (type === "page") {
            params.append("limit", String(rowsPerPage));
            params.append("page",String(page));
        }

        if (search) {
            Object.keys(search).forEach(key => {
                params.append(key, String(search[key]));
            });

            params.append("type_search", "like");
        }

        return await this.onSend(url +'?'+ params.toString(), {});
    }
}

type Search = { [keys: string]: string | number } | null;