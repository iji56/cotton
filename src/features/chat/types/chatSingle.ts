type ChatRouteParams = {
  chatID: string;
  receiverName: string;
  picture: string
};

export type ChatRouteType = {
  route: {
    params: ChatRouteParams;
  };
};