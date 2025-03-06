import axios, {AxiosRequestConfig} from "axios";

export const url = import.meta.env.VITE_API_URL;

export class ApiErrors {
    constructor(public errors: object[]) {
    }

    // public getErrors() {
    //     return this.errors.reduce(
    //         (p: any, c: any) => ({...p, [c.propertyPath]: c.message}),
    //         {}
    //     );
    // }
}
class ToSingleTon {
    private static instance: ToSingleTon;

    public static get getInstance() {
        this.instance = this.instance ? this.instance :  new this()
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
        if (sessionStorage.getItem("tia-wfs-token")) {
            this._headers.Authorization =
                "Bearer " + sessionStorage.getItem("tia-wfs-token");
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

        const response = await axios(options)
            .then((responses) => {
                return responses;
            })
            .catch((error) => {
                return Object.assign({}, error).response;
            });

        if (response?.status === 204) {
            return null;
        }

        if (response?.ok || response?.status === 200 || response?.status === 201) {
            return response.data;
        } else {
            if (response?.data) {
                throw new ApiErrors(response.data);
            }
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
