# SvelteKit eCommerce Store Starter App for MedusaJS

![Preview](https://github.com/pevey/sveltekit-medusa-starter/assets/7490308/e2b4fa4e-eb31-4082-aba3-b1cc26044ca0)

If you are not familiar with Medusa, you can learn more on [the project web site](https://www.medusajs.com/).

> Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

## Creating a project

```bash
# create a new project in the current directory
git clone git@github.com:pevey/sveltekit-medusa-starter.git ./

# create a new project in my-app
git clone git@github.com:pevey/sveltekit-medusa-starter.git my-app
```

## Installing packages

```bash
cd my-app
yarn install
```

## Configuring a project

```bash
mv .env.example .env
```
- Open .env and add any required settings
- Make sure to add http://localhost:5173 to your STORE_CORS in medusa-config.js in your medusa project folder.

## Running the app

```bash
yarn dev
```
