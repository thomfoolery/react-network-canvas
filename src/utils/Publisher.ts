class Publisher {
  _private = {
    subscriptionsById: new Map(),
  };

  constructor() {}

  notifyIds(ids: string[] = [], ...args) {
    ids.forEach((id) => {
      const subscriptions = this._private.subscriptionsById.get(id) || [];
      subscriptions.forEach((fn) => fn(...args));
    });
  }

  addListener(id, fn) {
    const subscriptions = this._private.subscriptionsById.get(id) || [];
    this._private.subscriptionsById.set(id, subscriptions.concat(fn));
  }

  removeListener(id, fn) {
    const subscriptions = this._private.subscriptionsById.get(id) || [];
    this._private.subscriptionsById.set(
      id,
      subscriptions.filter((f) => f !== fn)
    );
  }
}

export {Publisher};
