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

---

## 1. **Will it work out of the box in n8n?**

**Yes, it will work** when installed as a community node in n8n, provided that:

- You publish the **compiled JavaScript** (not TypeScript) to npm (the `dist/` directory).
- Your `package.json` is set up as you have it (with the `n8n` field, correct entry points, etc.).
- You do **not** require any non-standard dependencies that are not bundled with n8n or your package (e.g., you use only built-in Node.js modules like `crypto`).

---

## 2. **What does n8n do when you install a community node?**

- n8n downloads your package from npm.
- It loads the compiled JavaScript files from your package.
- It provides its own runtime, including the `n8n-workflow` and `n8n-core` packages.
- It provides Node.js built-in modules (like `crypto`), so you do **not** need to bundle or polyfill them.

---

## 3. **What you do NOT need to include in your npm package:**

- You do **not** need to include `@types/node` or `n8n-workflow` as runtime dependencies (they are only for development).
- You do **not** need to include your TypeScript source files (just the compiled JS and type declarations, if you want to support TypeScript users).

---

## 4. **What you DO need:**

- The compiled JavaScript files in the structure expected by n8n (e.g., `dist/nodes/NodMarketplace.node.js`).
- The `package.json` with the correct `main`, `types`, and `n8n` fields.
- Any assets (icons, etc.) referenced by your node.

---

## 5. **Special Notes:**

- If you use any npm packages that are **not** built-in Node.js modules, list them in your `dependencies` in `package.json`.
- If you use assets (like SVG icons), make sure they are included in your npm package and referenced correctly.

---

## 6. **Testing Before Publishing**

- You can test your node locally by running:
  ```sh
  npm pack
  ```
  Then install the resulting `.tgz` file in your n8n instance:
  ```sh
  npm install /path/to/n8n-nodes-nod-marketplace-1.0.0.tgz
  ```
  Restart n8n and check that your node appears and works.

---

## 7. **Summary Table**

| Requirement                | Needed in npm package? | Provided by n8n? |
|----------------------------|:---------------------:|:----------------:|
| Compiled JS (`dist/`)      |          ✅           |        —         |
| TypeScript (`.ts`)         |          ❌           |        —         |
| Type Declarations (`.d.ts`)|    Optional (✅)      |        —         |
| `@types/node`              |          ❌           |        —         |
| `n8n-workflow`             |          ❌           |        ✅        |
| Node.js built-ins (`crypto`)|         ❌           |        ✅        |
| Custom npm deps            |          ✅           |        —         |

---

**In summary:**  
If you publish your package as described, it will work in n8n as a community node. No extra steps are needed for `crypto` or `n8n-workflow` at runtime.

If you want a checklist for publishing or want to test locally before publishing, let me know! 