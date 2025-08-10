import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CustomLink, UserPreferencesState, EmailAddress } from '@/types';

interface CreateCustomLinkData {
  title: string;
  url: string;
  icon: string;
  color?: string;
  gradient?: string;
}

interface UpdateCustomLinkData extends CreateCustomLinkData {
  id: string;
}

interface PreferencesResponse {
  enabledLinks: string[];
  hasSetPreferences: boolean;
}

interface UpdatePreferencesData {
  enabledLinks: string[];
}

interface CreateEmailData {
  name: string;
  email: string;
  inboxUrl: string;
}

interface UpdateEmailData extends CreateEmailData {
  id: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Preferences', 'CustomLink', 'EmailAddress'],
  endpoints: (builder) => ({
    // Preferences endpoints
    getPreferences: builder.query<PreferencesResponse, void>({
      query: () => '/preferences',
      providesTags: ['Preferences'],
    }),
    updatePreferences: builder.mutation<PreferencesResponse, UpdatePreferencesData>({
      query: (data) => ({
        url: '/preferences',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Preferences'],
    }),

    // Custom links endpoints
    getCustomLinks: builder.query<CustomLink[], void>({
      query: () => '/custom-links',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'CustomLink' as const, id })),
              { type: 'CustomLink', id: 'LIST' },
            ]
          : [{ type: 'CustomLink', id: 'LIST' }],
    }),
    createCustomLink: builder.mutation<CustomLink, CreateCustomLinkData>({
      query: (data) => ({
        url: '/custom-links',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'CustomLink', id: 'LIST' }],
    }),
    updateCustomLink: builder.mutation<CustomLink, UpdateCustomLinkData>({
      query: ({ id, ...data }) => ({
        url: `/custom-links/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'CustomLink', id },
        { type: 'CustomLink', id: 'LIST' },
      ],
    }),
    deleteCustomLink: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/custom-links/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'CustomLink', id },
        { type: 'CustomLink', id: 'LIST' },
      ],
    }),

    // Email addresses endpoints
    getEmailAddresses: builder.query<{ emailAddresses: EmailAddress[] }, void>({
      query: () => '/emails',
      providesTags: (result) =>
        result?.emailAddresses
          ? [
              ...result.emailAddresses.map(({ id }) => ({ type: 'EmailAddress' as const, id })),
              { type: 'EmailAddress', id: 'LIST' },
            ]
          : [{ type: 'EmailAddress', id: 'LIST' }],
    }),
    createEmailAddress: builder.mutation<EmailAddress, CreateEmailData>({
      query: (data) => ({
        url: '/emails',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'EmailAddress', id: 'LIST' }],
    }),
    updateEmailAddress: builder.mutation<EmailAddress, UpdateEmailData>({
      query: ({ id, ...data }) => ({
        url: `/emails/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'EmailAddress', id },
        { type: 'EmailAddress', id: 'LIST' },
      ],
    }),
    deleteEmailAddress: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/emails/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'EmailAddress', id },
        { type: 'EmailAddress', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetCustomLinksQuery,
  useCreateCustomLinkMutation,
  useUpdateCustomLinkMutation,
  useDeleteCustomLinkMutation,
  useGetEmailAddressesQuery,
  useCreateEmailAddressMutation,
  useUpdateEmailAddressMutation,
  useDeleteEmailAddressMutation,
} = api;