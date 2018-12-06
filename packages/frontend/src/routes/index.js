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
export const CheckoutRoute: (string, string, string) => string = (
  eventName,
  eventId,
  ticketId
) =>
  `/ticket/checkout` +
  `/${encodeURI(eventName || ':eventName')}` +
  `/${encodeURI(eventId || ':eventId')}` +
  `/${encodeURI(ticketId || ':ticketId')}`;
export const CheckoutSubmitRoute: string = '/checkout/buy/submit';
export const TicketLockRoute: string => string = id =>
  `/ticket/lock/${encodeURI(id || ':id')}`;
export const TicketUnlockRoute: string => string = id =>
  `/ticket/unlock/${encodeURI(id || ':id')}`;
export const CheckoutInfoRoute: (string, string, string) => string = (
  id,
  shippingMethod,
  address
) =>
  `/checkout/info` +
  `/${encodeURI(id || ':id')}` +
  `/${encodeURI(shippingMethod || ':shippingMethod')}` +
  `/${encodeURI(address)}`;

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
