// @flow

export const HomeRoute: string = '/';

export const SearchSuggestionsRoute: string => string = query =>
  `search/suggestions/${query}`;

export const LoginRoute: string = '/login';
export const LoginSubmitRoute: string = '/login/submit';

export const CreateAccountRoute: string = '/create-account';
export const CreateAccountSubmitRoute: string = '/create-account/submit';

export const UpdateAccountRoute: string = '/update-account';
export const UpdateAccountSubmitRoute: string = '/account/submit';
