import { API_BASE_URL } from "../../../constants/constant";

export async function api(path: string, method = "POST", body?: any, token?: string) {
        const headers: any = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        console.log(API_BASE_URL);

        const res = await fetch(`${API_BASE_URL}${path}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Something went wrong");
        }

        return res.json();
}
