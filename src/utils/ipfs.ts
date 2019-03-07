/**
 * @module snet
 */

import axios from 'axios';

class Ipfs {
    static IPFS_API_URL = "http://ipfs.singularitynet.io/api/v0/";
    // http://ipfs.singularitynet.io/api/v0/cat?arg=QmZrWe2aPnzXqYvWgZGquUNs4Y7TjxyyEuNrGf5v5y4GMR

    static async cat(hash:string) {
        hash = hash.replace('ipfs://', '');
        return (await axios.get(this.IPFS_API_URL+'cat?arg='+hash)).data;
    }
}

export {Ipfs}