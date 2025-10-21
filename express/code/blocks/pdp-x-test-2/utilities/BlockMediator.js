/**
 * Simple pub/sub event mediator for block communication
 */
class BlockMediator {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers[event] = this.subscribers[event].filter((cb) => cb !== callback);
    };
  }

  publish(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach((callback) => callback(data));
    }
  }

  clear() {
    this.subscribers = {};
  }
}

// Create singleton instance
const mediator = new BlockMediator();

export default mediator;

