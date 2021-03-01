class Publisher {
  __ = {
    subscriptionsById: new Map(),
  };

  constructor() {}

  notifyIds(ids: string[] = [], ...args) {
    ids.forEach((id) => {
      const subscriptions = this.__.subscriptionsById.get(id) || [];

      subscriptions.forEach((fn) => fn(...args));
    });
  }

  notifyAll(...args) {
    this.__.subscriptionsById.forEach((fns) =>
      fns.forEach((fn) => fn(...args))
    );
  }

  addListenerForId(id, fn) {
    const subscriptions = this.__.subscriptionsById.get(id) || [];

    this.__.subscriptionsById.set(id, subscriptions.concat(fn));
  }

  removeListenerForId(id, fn) {
    const subscriptions = this.__.subscriptionsById.get(id) || [];

    this.__.subscriptionsById.set(
      id,
      subscriptions.filter((f) => f !== fn)
    );
  }
}

export {Publisher};
