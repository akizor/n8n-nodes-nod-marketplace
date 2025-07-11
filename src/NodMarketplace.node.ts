import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import * as crypto from 'crypto';
import type { NodeConnectionType } from 'n8n-workflow';

export class NodMarketplace implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'NOD Marketplace',
        name: 'nodMarketplace',
        icon: 'file:nodMarketplace.svg',
        group: ['transform'],
        version: 1,
        description: 'Interact with the NOD Marketplace API',
        defaults: {
            name: 'NOD Marketplace',
        },
        inputs: ['main' as NodeConnectionType],
        outputs: ['main' as NodeConnectionType],
        credentials: [
            {
                name: 'nodMarketplaceApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'Get Products',
                        value: 'getProducts',
                        description: 'Retrieve products from NOD',
                    },
                    {
                        name: 'Get Product',
                        value: 'getProduct',
                        description: 'Retrieve a single product by ID',
                    },
                    {
                        name: 'Get Categories',
                        value: 'getCategories',
                        description: 'Retrieve product categories',
                    },
                    {
                        name: 'Get Category',
                        value: 'getCategory',
                        description: 'Retrieve a single category by ID',
                    },
                    {
                        name: 'Get Manufacturers',
                        value: 'getManufacturers',
                        description: 'Retrieve manufacturers',
                    },
                ],
                default: 'getProducts',
                description: 'The operation to perform.',
            },
            {
                displayName: 'Page',
                name: 'page',
                type: 'number',
                default: 1,
                description: 'Page number for product listing',
                displayOptions: {
                    show: {
                        operation: ['getProducts'],
                    },
                },
            },
            {
                displayName: 'Product ID',
                name: 'productId',
                type: 'string',
                default: '',
                description: 'The ID of the product to retrieve',
                displayOptions: {
                    show: {
                        operation: ['getProduct'],
                    },
                },
            },
            {
                displayName: 'Category ID',
                name: 'categoryId',
                type: 'string',
                default: '',
                description: 'The ID of the category to retrieve',
                displayOptions: {
                    show: {
                        operation: ['getCategory'],
                    },
                },
            },
            {
                displayName: 'Code',
                name: 'code',
                type: 'string',
                default: '',
                description: 'Product code (part number) to filter by',
                displayOptions: {
                    show: {
                        operation: ['getProducts'],
                    },
                },
            },
            {
                displayName: 'Manufacturer',
                name: 'manufacturer',
                type: 'string',
                default: '',
                description: 'Manufacturer name to filter by',
                displayOptions: {
                    show: {
                        operation: ['getProducts'],
                    },
                },
            },
            {
                displayName: 'Category',
                name: 'category',
                type: 'string',
                default: '',
                description: 'Category ID to filter by',
                displayOptions: {
                    show: {
                        operation: ['getProducts'],
                    },
                },
            },
            {
                displayName: 'Search',
                name: 'search',
                type: 'string',
                default: '',
                description: 'Search term to filter products',
                displayOptions: {
                    show: {
                        operation: ['getProducts'],
                    },
                },
            },
            {
                displayName: 'Only Available (Stock)',
                name: 'stock',
                type: 'boolean',
                default: false,
                description: 'Show only products that are in stock',
                displayOptions: {
                    show: {
                        operation: ['getProducts'],
                    },
                },
            },
            {
                displayName: 'Only Promotional',
                name: 'promotion',
                type: 'boolean',
                default: false,
                description: 'Show only promotional products',
                displayOptions: {
                    show: {
                        operation: ['getProducts'],
                    },
                },
            },
            // Add more filters as needed
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const operation = this.getNodeParameter('operation', 0) as string;

        // Helper functions inside execute for type safety
        function getSignatureString(authKey: string, httpVerb: string, queryString: string, connectionUser: string, date: string): string {
            const signatureString = httpVerb + queryString.replace(/^\/+|\/+$/g, '') + '/' + connectionUser + date;
            return hmacSha1(authKey, signatureString);
        }
        function hmacSha1(authKey: string, msg: string): string {
            const hmac = crypto.createHmac('sha1', authKey);
            hmac.update(msg);
            return hmac.digest('base64');
        }
        function buildHeaders(username: string, password: string, httpVerb: string, queryString: string): { [key: string]: string } {
            const date = new Date().toUTCString();
            return {
                'X-NodWS-Date': date,
                'X-NodWS-User': username,
                'X-NodWS-Auth': getSignatureString(password, httpVerb, queryString, username, date),
                'X-NodWS-Accept': 'json',
            };
        }

        // Get credentials
        const credentials = await this.getCredentials('nodMarketplaceApi');
        const username = credentials.username as string;
        const password = credentials.password as string;
        const apiUrl = credentials.apiUrl as string;

        switch (operation) {
            case 'getProducts': {
                const page = this.getNodeParameter('page', 0) as number;
                const count = 100;
                // Build query params as array for consistent order
                const params: [string, string][] = [
                    ['count', count.toString()],
                    ['page', page.toString()],
                ];
                const code = this.getNodeParameter('code', 0, '') as string;
                const manufacturer = this.getNodeParameter('manufacturer', 0, '') as string;
                const category = this.getNodeParameter('category', 0, '') as string;
                let search = this.getNodeParameter('search', 0, '') as string;
                search = search.trim();
                const stock = this.getNodeParameter('stock', 0, false) as boolean;
                const promotion = this.getNodeParameter('promotion', 0, false) as boolean;
                if (code) params.push(['code', code]);
                if (manufacturer) params.push(['manufacturer', manufacturer]);
                if (category) params.push(['category', category]);
                if (search) params.push(['search', search]);
                if (stock) params.push(['only_available', '1']);
                if (promotion) params.push(['only_promotional', '1']);
                // Build query string
                const queryString = '/products/?' + params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
                const headers = buildHeaders(username, password, 'GET', queryString);
                const url = apiUrl.replace(/\/$/, '') + queryString;
                const options = {
                    method: 'GET' as const,
                    headers,
                    url,
                    json: true,
                };
                const data = await this.helpers.httpRequest.call(this, options);
                if (data.result && data.result.products) {
                    for (const product of data.result.products) {
                        returnData.push({ json: product });
                    }
                } else {
                    returnData.push({ json: data });
                }
                break;
            }
            case 'getProduct': {
                const productId = this.getNodeParameter('productId', 0) as string;
                let queryString = `/products/${productId}`;
                const headers = buildHeaders(username, password, 'GET', queryString);
                const url = apiUrl.replace(/\/$/, '') + queryString;
                const options = {
                    method: 'GET' as const,
                    headers,
                    url,
                    json: true,
                };
                const data = await this.helpers.httpRequest.call(this, options);
                if (data.product) {
                    returnData.push({ json: data.product });
                } else {
                    returnData.push({ json: data });
                }
                break;
            }
            case 'getCategories': {
                let queryString = '/product-categories/';
                const headers = buildHeaders(username, password, 'GET', queryString);
                const url = apiUrl.replace(/\/$/, '') + queryString;
                const options = {
                    method: 'GET' as const,
                    headers,
                    url,
                    json: true,
                };
                const data = await this.helpers.httpRequest.call(this, options);
                if (data.product_categories) {
                    for (const category of data.product_categories) {
                        returnData.push({ json: category });
                    }
                } else {
                    returnData.push({ json: data });
                }
                break;
            }
            case 'getCategory': {
                const categoryId = this.getNodeParameter('categoryId', 0) as string;
                let queryString = `/product-categories/${categoryId}`;
                const headers = buildHeaders(username, password, 'GET', queryString);
                const url = apiUrl.replace(/\/$/, '') + queryString;
                const options = {
                    method: 'GET' as const,
                    headers,
                    url,
                    json: true,
                };
                const data = await this.helpers.httpRequest.call(this, options);
                if (data.product_category) {
                    returnData.push({ json: data.product_category });
                } else {
                    returnData.push({ json: data });
                }
                break;
            }
            case 'getManufacturers': {
                let queryString = '/manufacturers/';
                const headers = buildHeaders(username, password, 'GET', queryString);
                const url = apiUrl.replace(/\/$/, '') + queryString;
                const options = {
                    method: 'GET' as const,
                    headers,
                    url,
                    json: true,
                };
                const data = await this.helpers.httpRequest.call(this, options);
                if (data.manufacturers) {
                    for (const manufacturer of data.manufacturers) {
                        returnData.push({ json: manufacturer });
                    }
                } else {
                    returnData.push({ json: data });
                }
                break;
            }
            default:
                throw new Error(`The operation ${operation} is not supported!`);
        }

        return [returnData];
    }
}

export const tools = [
  {
    name: 'getProducts',
    description: 'Retrieve a list of products from the NOD Marketplace with optional filters.',
    parameters: [
      { name: 'page', type: 'number', description: 'Page number for pagination.' },
      { name: 'manufacturer', type: 'string', description: 'Filter by manufacturer name.' },
      { name: 'category', type: 'string', description: 'Filter by category ID.' },
      { name: 'stock', type: 'boolean', description: 'Only show products in stock.' },
      { name: 'promotion', type: 'boolean', description: 'Only show promotional products.' },
      { name: 'search', type: 'string', description: 'Search term for product name or description.' },
      { name: 'code', type: 'string', description: 'Filter by product code (part number).' },
    ],
  },
  {
    name: 'getProduct',
    description: 'Retrieve a single product by its ID.',
    parameters: [
      { name: 'productId', type: 'string', description: 'The ID of the product to retrieve.' },
    ],
  },
  {
    name: 'getCategories',
    description: 'Retrieve all product categories from the NOD Marketplace.',
    parameters: [],
  },
  {
    name: 'getCategory',
    description: 'Retrieve a single category by its ID.',
    parameters: [
      { name: 'categoryId', type: 'string', description: 'The ID of the category to retrieve.' },
    ],
  },
  {
    name: 'getManufacturers',
    description: 'Retrieve all manufacturers from the NOD Marketplace.',
    parameters: [],
  },
];
