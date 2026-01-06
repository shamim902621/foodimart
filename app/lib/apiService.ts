// import { API_BASE_URL } from "../../constants/constant";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export async function api(path: string, method = "POST", body?: any, token?: string) {
//         const headers: any = { "Content-Type": "application/json" };
//         if (token) headers.Authorization = `Bearer ${token}`;
//         console.log(API_BASE_URL);

//         const res = await fetch(`${API_BASE_URL}${path}`, {
//                 method,
//                 headers,
//                 body: body ? JSON.stringify(body) : undefined,
//         });

//         if (!res.ok) {
//                 const error = await res.json();
//                 throw new Error(error.message || "Something went wrong");
//         }

//         return res.json();
// }



// export async function apiFormData(path: any, method = "POST", formData: any, token?: string) {
//         // const token = await AsyncStorage.getItem("authToken");

//         const headers = {
//                 Authorization: `Bearer ${token}`,
//                 // DO NOT set content-type
//         };

//         const res = await fetch(`${API_BASE_URL}${path}`, {
//                 method,
//                 headers,
//                 body: formData,
//         });

//         const data = await res.json();

//         if (!res.ok) {
//                 throw new Error(data.message || "Something went wrong");
//         }

//         return data;
// }



import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../constants/constant";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function getAuthToken() {
  return await AsyncStorage.getItem("authToken");
}

export interface Address {
  id: number; // or string depending on DB
  type: 'Home' | 'Work' | 'Other';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault: boolean;
}

export async function api<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: any
): Promise<T> {
  const token = await getAuthToken();

  const headers: any = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "API Error");
    }

    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiFormData<T>(
  path: string,
  method: HttpMethod = "POST",
  formData: FormData
): Promise<T> {
  const token = await getAuthToken();

  const headers: any = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Upload failed");
  }

  return data;
}


type ShopQuery = {
  category?: string;
  filter?: string;
};

export async function getShops(query?: ShopQuery) {
  const params = new URLSearchParams();

  if (query?.category) params.append("category", query.category);
  if (query?.filter) params.append("filter", query.filter);

  const queryString = params.toString();
  const url = queryString
    ? `/users/shops/category?${queryString}`
    : `/users/shops/category`;

  const res: any = await api(url);

  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function getShopById(id: string) {
  const res: any = await api(`/users/shops/getShopById/${id}`);
  if (!res.success) throw new Error(res.message);
  return res.data;
}