import { TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { IAtomicSwapConditions } from '../interfaces/atomic-swap-conditions';
export declare function parseAtomicSwapRepresentative(representative: TAccount, delegation?: boolean): (undefined | IAtomicSwapConditions);
