import '@testing-library/jest-dom';

// jsdom doesn't implement ResizeObserver. @dnd-kit observes panel sizes during
// drag operations, so a no-op stub is enough to let the components mount.
const ResizeObserverStub: typeof ResizeObserver = class {
  observe() {
    // intentionally empty
  }
  unobserve() {
    // intentionally empty
  }
  disconnect() {
    // intentionally empty
  }
};

if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = ResizeObserverStub;
}

// jsdom doesn't implement Document.getAnimations or Element.getAnimations.
// @dnd-kit's idle-transition logic calls them when reading/canceling active
// animations; a no-op stub is enough for tests.
if (typeof Document !== 'undefined') {
  const docProto = Document.prototype as Document & {
    getAnimations?: () => unknown[];
  };
  if (typeof docProto.getAnimations !== 'function') {
    docProto.getAnimations = () => [];
  }
}
if (typeof Element !== 'undefined') {
  const elProto = Element.prototype as Element & {
    getAnimations?: () => unknown[];
  };
  if (typeof elProto.getAnimations !== 'function') {
    elProto.getAnimations = () => [];
  }
}

// jsdom doesn't implement HTMLDialogElement.showModal/close, so polyfill them
// onto the prototype with the minimal behavior our ConfirmDialog relies on:
// flipping `open` and dispatching the `close` event.
if (typeof HTMLDialogElement !== 'undefined') {
  const proto = HTMLDialogElement.prototype;
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (typeof proto.close !== 'function') {
    proto.close = function close(this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
}
