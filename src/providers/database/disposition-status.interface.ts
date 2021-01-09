export enum IsDisposed {
    false,
    true
}

export interface IDispositionStatus {
    leadId: string;
    calledAt: number;
    isDisposed: IsDisposed
}