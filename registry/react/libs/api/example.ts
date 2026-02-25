// ============================================================================
// API CLIENT - Modular Endpoints
// ============================================================================

import { apiClient } from "@/lib/api-client";
import type {
  OrganisationCore,
  OrganisationMember,
  ProductFilters,
  Role,
} from "types";
import {
  BUSINESS_URL,
  EDIT_MEMBERS_URL,
  LIST_BUSINESS_URL,
  LIST_MEMBERS_URL,
  MEMBERS_URL,
} from "utils/endpoints";

/**
 * @example
 * ```ts
 * return await organisationsApi.update(session.accessToken, id, {
          name: name!,
          email: email!,
          description: desc!,
          address,
          phone_number: phone,
          logo_url: url,
        });
        ```
 */
export const organisationsApi = {
  // Core data
  getAll: (token: string) =>
    apiClient.get<OrganisationCore[]>(BUSINESS_URL, token),

  getById: (token: string, id: string) =>
    apiClient.get<OrganisationCore>(BUSINESS_URL + id, token),

  create: (
    token: string,
    data: {
      name: string;
      email: string;
      description: string;
      address?: string;
      phone_number?: string;
      logo?: File | undefined;
      logo_url?: string;
    },
  ) => apiClient.post<OrganisationCore>(BUSINESS_URL, token, data),

  // TODO::This one
  update: (
    token: string,
    id: string,
    data: {
      name: string;
      email: string;
      description: string;
      address?: string;
      phone_number?: string;
      logo_url?: string;
    },
  ) => apiClient.put<OrganisationCore>(BUSINESS_URL + id, token, data),

  delete: (token: string, id: string) =>
    apiClient.delete<undefined>(BUSINESS_URL + id, token),

  // Members data
  getMembers: (token: string, id: string) =>
    apiClient.get<OrganisationMember[]>(
      BUSINESS_URL + id + LIST_MEMBERS_URL,
      token,
    ),

  // TODO::ENDPOINT NOT RESOLVED YET
  addMember: (
    token: string,
    id: string,
    data: { user_id: string; role: string },
  ) =>
    apiClient.post<OrganisationMember>(
      BUSINESS_URL + id + MEMBERS_URL,
      token,
      data,
    ),

  addMemberByEmail: (
    token: string,
    id: string,
    data: {
      name?: string;
      email: string;
      password?: string;
      role: Role;
    },
  ) =>
    apiClient.post<OrganisationMember>(
      BUSINESS_URL + id + MEMBERS_URL,
      token,
      data,
    ),

  updateMember: (
    token: string,
    id: string,
    memberId: string,
    data: {
      is_active?: boolean;
      role?: Role;
    },
  ) =>
    apiClient.post<OrganisationMember>(
      BUSINESS_URL + id + MEMBERS_URL + memberId + EDIT_MEMBERS_URL,
      token,
      data,
    ),

  removeMember: (token: string, id: string, memberId: string) =>
    apiClient.delete<undefined>(
      LIST_BUSINESS_URL + id + MEMBERS_URL + memberId,
      token,
    ),
};

export const organisationKeys = {
  // All organisations
  all: ["organisations"] as const,

  // Organisation lists
  lists: () => [...organisationKeys.all, "list"] as const,
  list: (filters?: string) =>
    [...organisationKeys.lists(), { filters }] as const,

  // Single organisation (all modules)
  details: () => [...organisationKeys.all, "detail"] as const,
  detail: (id: string) => [...organisationKeys.details(), id] as const,

  // Organisation modules (specific data)
  core: (id: string) => [...organisationKeys.detail(id), "core"] as const,
  members: (id: string) => [...organisationKeys.detail(id), "members"] as const,

  products: (id: string) =>
    [...organisationKeys.detail(id), "products"] as const,
  product: (id: string) => ["product", id] as const,
  prodlist: (id: string, filters?: ProductFilters) =>
    [...organisationKeys.detail(id), "products", { filters }] as const,
};

/*
CACHE STRUCTURE:
["organisations"]                              // All org data
  ["organisations", "list"]                    // List of orgs
  ["organisations", "detail", "org_123"]       // Org org_123 (all modules)
    ["organisations", "detail", "org_123", "core"]      // Core data
    ["organisations", "detail", "org_123", "meta"]      // Meta data
    ["organisations", "detail", "org_123", "members"]   // Members
    ["organisations", "detail", "org_123", "customers"] // Customers
*/
