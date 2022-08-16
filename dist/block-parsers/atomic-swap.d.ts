import { IAtomicSwapConditions } from '../interfaces/atomic-swap-conditions';
import { TAccount } from "../types/banano";
export declare function parseAtomicSwapRepresentative(representative: TAccount, delegation?: boolean): (undefined | IAtomicSwapConditions);
