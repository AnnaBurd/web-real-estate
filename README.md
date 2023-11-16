# <img src="public/favicon.svg" width="48" style="margin-bottom:-16px"> VietLand - Real Estate App

> A web application that blends modern design approaches with a timeless and intuitive UI, designed and developed exclusively for the local small-scale real estate business.

[![Netlify Status](https://api.netlify.com/api/v1/badges/2bd48f01-8fed-412f-b2af-bf1b88eb54ab/deploy-status)](https://app.netlify.com/sites/rainbow-selkie-885930/deploys)

The main objective of this project is to help the local business establish a strong connection with potential customers and create an outstanding first impression, ultimately giving the business a distinct advantage amidst the fiercely demanding marketplace.

Initial constraints that we needed to address:

- user-friendly design with an understanding of local language and cultural distinctiveness
- competitive performance on mobile devices
- smooth delivery and uncomplicated content management processes
- **restricted budget**

In this particular scenario, the approach taken was to generate static pages rather than rely on client-side or server-side rendering. The client-side rendering was ruled off due to the significance placed on mobile performance and search engine optimization (SEO). Meanwhile, the idea of spending on the development/hosting/management of the backend side ruled off the server-side rendering approach as well. Instead of overinvesting in the backend infrastructure, we choose the services of the headless CMS (with generous free tiers).

And, although static pages sound … lifeless, the app pages have been designed in a manner that does not give off a static impression entirely! The secret is the usage of component-based islands of JS interactivity whenever necessary.

[**View Viet Land App (Live)**](https://deft-entremet-3bc804.netlify.app/ "Viet Land App")

## Key Features

- Mobile-first responsive design

![](preview/mockup.jpg)
&nbsp;

- Forms with intuitive UI

- Interactive search

- Responsive map

- Integration with Contentful CMS

## Designed with and Build with

![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
<a href="https://astro.build"><img src="https://astro.badg.es/v2/built-with-astro/small.svg" alt="Built with Astro" width="170" height="28"></a>

## Installation

Linux & Windows:

```bash
npm install     # Install dependencies
npm run build   # Build production version
npm run dev     # Run in development mode
```

This will run the frontend (client) part of the application, the backend (api) is [here](https://github.com/AnnaBurd/translator-app-ts-api)

TODO:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 👀 Want to contribute?

1. Fork project (<https://github.com/AnnaBurd/web-real-estate/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

[Discuss Issues](https://www.linkedin.com/in/anna-burdanova-b91453218/)
