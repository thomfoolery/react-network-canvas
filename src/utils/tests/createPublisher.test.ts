import { createPublisher } from "..";

it("notifys all subscribed functions", () => {
  const publisher = createPublisher();
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  publisher.addListenerForId("1", subscriber1);
  publisher.addListenerForId("2", subscriber2);

  publisher.notifyAll(1, 2, 3);

  expect(subscriber1).toBeCalledWith(1, 2, 3);
  expect(subscriber2).toBeCalledWith(1, 2, 3);
});

it("does not notify unsubscribed functions", () => {
  const publisher = createPublisher();
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  publisher.addListenerForId("1", subscriber1);
  publisher.addListenerForId("2", subscriber2);
  publisher.removeListenerForId("1", subscriber1);

  publisher.notifyAll(1, 2, 3);

  expect(subscriber1).not.toBeCalledWith(1, 2, 3);
  expect(subscriber2).toBeCalledWith(1, 2, 3);
});

it("notifys only the provided ids functions", () => {
  const publisher = createPublisher();
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  publisher.addListenerForId("1", subscriber1);
  publisher.addListenerForId("2", subscriber2);

  publisher.notifyIds(["1"], 1, 2, 3);

  expect(subscriber1).toBeCalledWith(1, 2, 3);
  expect(subscriber2).not.toBeCalledWith(1, 2, 3);
});
