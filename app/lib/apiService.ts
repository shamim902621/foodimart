import { API_BASE_URL } from "../../constants/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function api(path: string, method = "POST", body?: any, token?: string) {
        debugger
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



export async function apiFormData(path: any, method = "POST", formData: any, token?: string) {
        // const token = await AsyncStorage.getItem("authToken");

        const headers = {
                Authorization: `Bearer ${token}`,
                // DO NOT set content-type
        };

        const res = await fetch(`${API_BASE_URL}${path}`, {
                method,
                headers,
                body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
        }

        return data;
}

