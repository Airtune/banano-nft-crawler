import { NanoNode } from "nano-account-crawler/dist/nano-node";
import * as fetch from 'node-fetch';

const NODE_RPC_URL = 'http://145.239.223.42:7072';
if (typeof(NODE_RPC_URL) !== 'string' || NODE_RPC_URL.length == 0) {
  throw 'set NODE_RPC_URL in bananode.ts before running tests!'
}

export const bananode = new NanoNode(NODE_RPC_URL, fetch);
