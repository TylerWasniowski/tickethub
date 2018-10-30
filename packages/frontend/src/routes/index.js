// @flow

export const HomeRoute: string = '/';

export const SearchSuggestionsRoute: string => string = query =>
  `search/suggestions/${query}`;

export const LoginRoute: string = '/account/login';
export const LoginSubmitRoute: string = '/account/login/submit';

export const CreateAccountRoute: string = '/account/create-account';
export const CreateAccountSubmitRoute: string =
  '/account/create-account/submit';

export const UpdateAccountRoute: string = '/account/update';
export const UpdateAccountSubmitRoute: string = '/account/update/submit';
