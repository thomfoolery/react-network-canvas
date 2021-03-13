import * as Types from "@component/types";

function createPublisher(): Types.Publisher {
  const __ = {
    subscriptionsById: new Map(),
  };

  return {
    notifyIds(ids: string[] = [], ...args) {
      ids.forEach((id) => {
        const subscriptions = __.subscriptionsById.get(id) || [];

        subscriptions.forEach((fn) => fn(...args));
      });
    },

    notifyAll(...args) {
      __.subscriptionsById.forEach((fns) => fns.forEach((fn) => fn(...args)));
    },

    addListenerForId(id, fn) {
      const subscriptions = __.subscriptionsById.get(id) || [];

      __.subscriptionsById.set(id, subscriptions.concat(fn));
    },

    removeListenerForId(id, fn) {
      const subscriptions = __.subscriptionsById.get(id) || [];

      __.subscriptionsById.set(
        id,
        subscriptions.filter((f) => f !== fn)
      );
    },
  };
}

export {createPublisher};
