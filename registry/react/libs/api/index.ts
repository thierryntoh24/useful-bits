// Handy API client created for a project. Will obviously need refactoring to fit your specific project.

import { getServerErrorMessage } from "@/lib/auth-error-state";
import type { BackendResponse, Pagination, ServerActionState } from "types";
import { cleanPayload, genericErrorState, genericNetworkError } from "utils";

interface FetchOptions extends RequestInit {
  token?: string; // Pass token explicitly
  blob?: boolean; //special prop to hanndle files (invoice receipt)
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.BASE_URL || "[BASE_URL]") {
    this.baseUrl = baseUrl;
  }

  async fetch<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<ServerActionState & { data?: T; meta?: Pagination; blob?: Blob }> {
    const { token, blob, ...fetchOptions } = options;

    if (!token) {
      throw new Error("Access token required for API requests");
      // Or redirect to auth page here
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...fetchOptions.headers,
        },
      });

      // blob for file data responses
      if (blob) {
        const blob = await res.blob();
        return { success: true, blob };
      }

      const raw = await res.json();
      const result = raw as BackendResponse; // types for the backend response (usecase dependent)

      if (!res.ok) {
        const error = result.error;

        return {
          success: false,
          message: error.message, // or your custom error message,
        };
      }

      const data = result.data as T;
      const meta = result.pagination as Pagination | undefined;

      return { success: true, data, meta };
    } catch (err) {
      return genericNetworkError((err as any).message) || genericErrorState();
    }
  }

  get<T>(endpoint: string, token: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, token, method: "GET" });
  }

  post<T>(endpoint: string, token: string, data?: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      token,
      method: "POST",
      body: JSON.stringify(cleanPayload(data)),
    });
  }

  put<T>(endpoint: string, token: string, data?: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      token,
      method: "PUT",
      body: JSON.stringify(cleanPayload(data)),
    });
  }

  delete<T>(endpoint: string, token: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, token, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
