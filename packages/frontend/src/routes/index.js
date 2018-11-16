// @flow

export const HomeRoute: string = '/';

export const SearchSuggestionsRoute: string => string = query =>
  `/search/suggestions/${encodeURI(query || ':query')}`;
export const SearchRoute: string => string = query =>
  `/search/${encodeURI(query || ':query')}`;
export const SearchTicketsRoute: string => string = query =>
  `/search/tickets/${encodeURI(query || ':query')}`;

export const GetTicketsRoute: string => string = eventId =>
  `/event/tickets/${encodeURI(eventId || ':eventId')}`;
export const TicketCheckoutRoute: string => string = (eventName, id) =>
  `/ticket/checkout/${encodeURI(eventName || ':eventName')}/${encodeURI(
    id || ':id'
  )}`;
export const TicketLockRoute: string => string = id =>
  `/ticket/lock/${encodeURI(id || ':id')}`;
export const TotalTicketPriceRoute: string => string = id =>
  `/ticket/sale-charge/${encodeURI(id || ':id')}`;

export const LoginRoute: string = '/account/login';
export const LoginSubmitRoute: string = '/account/login/submit';

export const LogoutSubmitRoute: string = '/account/logout';

export const CreateAccountRoute: string = '/account/create-account';
export const CreateAccountSubmitRoute: string =
  '/account/create-account/submit';

export const UpdateAccountRoute: string = '/account/update';
export const UpdateAccountSubmitRoute: string = '/account/update/submit';

export const SellTicketRoute: string = '/ticket/sell';
export const SellTicketSubmitRoute: string = '/ticket/sell/submit';

export const GetEventImageRoute: string => string = id =>
  `/event/image/${encodeURI(id || ':id')}`;
