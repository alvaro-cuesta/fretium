import { useCallback, useEffect, useRef } from 'react';
import { useLatest } from './useLatest';

type MutationObserverLifecycleRefCallback<TNode extends Node> = (
  node: TNode | null,
) => undefined | (() => void);

type MutationObserverLifecycleCleanup = () => void;

type MutationObserverLifecycleCallback<TNode extends Node> = (
  node: TNode,
  mutations: MutationRecord[],
  observer: MutationObserver,
) => undefined | MutationObserverLifecycleCleanup;

/**
 * Observes a node via a ref callback and runs the lifecycle callback on:
 * - initial attach,
 * - dependency-list changes while attached,
 * - actual MutationObserver deliveries.
 *
 * Synthetic attach/dependency runs receive an empty mutation-record array.
 */
export function useMutationObserverLifecycle<TNode extends Node>(
  callback: MutationObserverLifecycleCallback<TNode>,
  deps: React.DependencyList,
  options: MutationObserverInit,
): MutationObserverLifecycleRefCallback<TNode> {
  const latestCallback = useLatest(callback);

  const observedNodeRef = useRef<TNode | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const mutationCleanupRef = useRef<
    undefined | MutationObserverLifecycleCleanup
  >(undefined);
  const didRunInitialDepsEffectRef = useRef(false);

  const attributeFilter = options.attributeFilter;
  const {
    attributes,
    attributeOldValue,
    characterData,
    characterDataOldValue,
    childList,
    subtree,
  } = options;

  const runCallback = useCallback(
    (mutations: MutationRecord[]) => {
      const node = observedNodeRef.current;
      const observer = observerRef.current;

      if (!node || !observer) {
        return;
      }

      mutationCleanupRef.current?.();
      mutationCleanupRef.current = latestCallback.current(
        node,
        mutations,
        observer,
      );
    },
    [latestCallback],
  );

  const disconnect = useCallback(() => {
    mutationCleanupRef.current?.();
    mutationCleanupRef.current = undefined;

    observerRef.current?.disconnect();
    observerRef.current = null;
    observedNodeRef.current = null;
  }, []);

  useEffect(() => disconnect, [disconnect]);

  useEffect(() => {
    if (!didRunInitialDepsEffectRef.current) {
      didRunInitialDepsEffectRef.current = true;
      return;
    }

    runCallback([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-x/exhaustive-deps -- dynamic dependency list provided by hook consumer
  }, deps);

  return useCallback<MutationObserverLifecycleRefCallback<TNode>>(
    (node) => {
      disconnect();

      if (!node) {
        return;
      }
      observedNodeRef.current = node;

      const observer = new MutationObserver((mutations) => {
        runCallback(mutations);
      });

      const nextOptions: MutationObserverInit = {};

      if (attributes !== undefined) {
        nextOptions.attributes = attributes;
      }

      if (attributeOldValue !== undefined) {
        nextOptions.attributeOldValue = attributeOldValue;
      }

      if (characterData !== undefined) {
        nextOptions.characterData = characterData;
      }

      if (characterDataOldValue !== undefined) {
        nextOptions.characterDataOldValue = characterDataOldValue;
      }

      if (childList !== undefined) {
        nextOptions.childList = childList;
      }

      if (subtree !== undefined) {
        nextOptions.subtree = subtree;
      }

      if (attributeFilter) {
        nextOptions.attributeFilter = attributeFilter;
      }

      observer.observe(node, nextOptions);
      observerRef.current = observer;
      runCallback([]);

      const cleanup = () => {
        if (observerRef.current !== observer) {
          return;
        }

        disconnect();
      };

      return cleanup;
    },
    [
      attributeFilter,
      attributes,
      attributeOldValue,
      characterData,
      characterDataOldValue,
      childList,
      disconnect,
      runCallback,
      subtree,
    ],
  );
}
