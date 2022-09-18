interface SWEvent extends Event {
    detail: ServiceWorkerRegistration;
}

interface customEventMap {
    swUpdated: CustomEvent<ServiceWorkerRegistration>;
}

declare global {
    interface Document {
        //adds definition to Document, but you can do the same with HTMLElement
        addEventListener<K extends keyof CustomEventMap>(
            type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void
        ): void;
    }
}
