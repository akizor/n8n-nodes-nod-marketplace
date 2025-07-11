"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodMarketplaceApi = void 0;
class NodMarketplaceApi {
    constructor() {
        this.name = 'nodMarketplaceApi';
        this.displayName = 'NOD Marketplace API';
        this.documentationUrl = '';
        this.properties = [
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
            {
                displayName: 'API URL',
                name: 'apiUrl',
                type: 'string',
                default: 'https://api.b2b.nod.ro',
            },
        ];
    }
}
exports.NodMarketplaceApi = NodMarketplaceApi;
