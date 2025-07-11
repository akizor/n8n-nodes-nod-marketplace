# n8n NOD Marketplace Node

This custom n8n node allows you to interact with the [NOD Marketplace API](https://api.b2b.nod.ro) directly from your n8n workflows. It provides operations to fetch products, categories, manufacturers, and more, making it easy to automate your e-commerce and integration tasks.

## Features
- Get Products (with pagination)
- Get Product by ID
- Get Categories
- Get Category by ID
- Get Manufacturers

## Installation

1. **Clone or copy this repository into your n8n custom nodes directory.**
   - Recommended: `~/.n8n/custom/nodes/` or your project's `nodes/` directory.
2. **Install dependencies** (if any, e.g., `npm install`).
3. **Transpile TypeScript to JavaScript** (if using TypeScript):
   ```sh
   tsc
   ```
4. **Restart your n8n instance.**

## Usage

1. **Add Credentials**
   - In n8n, go to "Credentials" and create a new credential for "NOD Marketplace API".
   - Fill in your Username, Password, and (optionally) API URL.

2. **Add the Node to a Workflow**
   - Drag the "NOD Marketplace" node into your workflow.
   - Select the desired operation (e.g., Get Products, Get Product).
   - Fill in any required parameters (e.g., Product ID, Category ID).
   - Connect and run your workflow.

## Credentials
- **Username**: Your NOD Marketplace API username
- **Password**: Your NOD Marketplace API password
- **API URL**: (Optional) Override the default API URL (`https://api.b2b.nod.ro`)

## Available Operations
- **Get Products**: Retrieve a paginated list of products
- **Get Product**: Retrieve a single product by its ID
- **Get Categories**: Retrieve all product categories
- **Get Category**: Retrieve a single category by its ID
- **Get Manufacturers**: Retrieve all manufacturers

## Example Workflow
```
[NOD Marketplace Node] --(Get Products)--> [Set] --(Format Data)--> [HTTP Request/Database/Other Node]
```

## Development
- Node code: `nodes/NodMarketplace.node.ts`
- Credentials: `nodes/NodMarketplaceApi.credentials.ts`

## License
MIT (or your preferred license)

---

**Contributions and feedback are welcome!** 
