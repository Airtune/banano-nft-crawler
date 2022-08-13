import { NanoNode } from "nano-account-crawler/dist/nano-node";
import * as fetch from 'node-fetch';

const NODE_RPC_URL = '';
if (NODE_RPC_URL == '') {
  throw 'set NODE_RPC_URL in bananode.ts before running tests!'
}

export const bananode = new NanoNode(NODE_RPC_URL, fetch);
