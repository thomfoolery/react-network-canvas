interface Publisher {
  notifyIds(ids: string[], ...args): void;
  notifyAll(...args): void;
  addListenerForId(id, fn): void;
  removeListenerForId(id, fn): void;
}

export {Publisher};
