export type MessageState = {
  text: string;
  variant: "error" | "success" | "warning" | "info";
};

// Union type MessageStoreState with any StoreState type to get additional messsage related properties.
export type MessageStoreState = {
  message?: MessageState;
};

// Extend store actions with the following message store actions.
export const messageStoreActions = {
  setMessageState: (message?: MessageState) => ({ setState }) => {
    setState({
      message: message
    });
  }
};
