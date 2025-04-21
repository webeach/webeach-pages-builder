# @webeach/pages-builder

A Node.js package for building structured JSON pages from Markdown and YAML content.

## 🚀 Features

- Parses page metadata from **YAML** files.
- Extracts and processes **Markdown** content with metadata.
- Supports **multiple languages** per page.
- Generates structured **JSON files** for easy integration.
- CLI support for automation.

---

<!-- TOC -->
* [@webeach/pages-builder](#webeachpages-builder)
  * [🚀 Features](#-features)
  * [📦 Installation](#-installation)
  * [⚡ Usage](#-usage)
    * [**CLI Usage**](#cli-usage)
      * [**Available Commands**](#available-commands)
      * [**CLI Options**](#cli-options)
    * [**Programmatic API**](#programmatic-api)
  * [📂 Project Structure](#-project-structure)
  * [📜 Example `structure.yml`](#-example-structureyml)
  * [📜 Output Structure JSON](#-output-structure-json)
  * [📝 Example `page.yml`](#-example-pageyml)
  * [✅ Example Markdown Content (`content.en.md`)](#-example-markdown-content-contentenmd)
  * [📜 Output JSON Example](#-output-json-example)
  * [🔖 Releasing a New Version](#-releasing-a-new-version)
  * [👨‍💻 Author](#-author)
  * [📄 License](#-license)
<!-- TOC -->

---

## 📦 Installation

```sh
yarn add @webeach/pages-builder
```

---

## ⚡ Usage

### **CLI Usage**
```sh
webeach-pages-builder build-pages --inputFile=./content/structure.yml --outputDir=dist
```

#### **Available Commands**

- `build-pages` → Builds all pages from a structured input file.

#### **CLI Options**

| Option               | Required | Default | Description                                                                     |
|----------------------|:--------:|:-------:|---------------------------------------------------------------------------------|
| `--inputFile <path>` |  ✅ Yes   |    –    | Path to the file containing the page structure.                                 |
| `--outputDir <path>` |   ❌ No   | `dist`  | Output directory where pages will be built.                                     |
| `--minify`           |   ❌ No   | `true`  | Whether to output minified (single-line) JSON. Use `--minify=false` to disable. |


### **Programmatic API**

```ts
import { buildAllPages } from '@webeach/pages-builder';

await buildAllPages('./content/structure.yml', './dist');
```

---

## 📂 Project Structure

Your project should be structured like this:

```
content/
  ├── structure.yml  # Defines page metadata and references
  ├── pages/
  │   ├── html/
  │   │   ├── tags/
  │   │   │   ├── div/
  │   │   │   │   ├── page.yml
  │   │   │   │   ├── content.ru.md
  │   │   │   │   ├── content.en.md
  │   │   │   │   └── ...
  │   │   │   ├── p/
  │   │   │   │   ├── page.yml
  │   │   │   │   ├── content.ru.md
  │   │   │   │   ├── content.en.md
  │   │   │   │   └── ...
  │   │   └── ...
  │   ├── css/
  │   │   ├── properties/
  │   │   │   ├── background-color/
  │   │   │   │   ├── page.yml
  │   │   │   │   ├── content.ru.md
  │   │   │   │   ├── content.en.md
  │   │   │   │   └── ...
  │   │   │   ├── border-radius/
  │   │   │   │   ├── page.yml
  │   │   │   │   ├── content.ru.md
  │   │   │   │   ├── content.en.md
  │   │   │   │   └── ...
  │   │   └── ...
```

---

## 📜 Example `structure.yml`

```yaml
pages:
  - id: "html.tags.div"
    route: "/html/div"
    ref: "./html/tags/div/page.yml"

  - id: "css.properties.background-color"
    route: "/css/background-color"
    ref: "./css/properties/background-color/page.yml"

  - id: "css.properties.border-radius"
    parentId: "css"
    route:
      path: "/css/border-radius"
      aliases:
        - "/css/-webkit-border-radius"
        - "/css/-moz-border-radius"
    ref: "./css/properties/border-radius/page.yml"
```

---

## 📜 Output Structure JSON

In addition to page JSON files, the output structure is saved as:

```
dist/
├── pages/
│   ├── {uuid}/
│   │   ├── ru.json
│   │   ├── en.json
│   │   └── ...
├── structure.json  # Contains metadata for all generated pages
```

This `structure.json` file includes mappings of pages and their routes.

---

---

## 📝 Example `page.yml`

```yaml
content:
  ru: "content.ru.md"
  en: "content.en.md"

properties:
  title:
    ru: "Блок div"
    en: "Div Block"
  description:
    ru: "HTML-тег `<div>` представляет контейнер..."
    en: "The HTML `<div>` tag represents a container..."
  tags:
    ru: ["html", "container"]
    en: ["html", "container"]
```

---

## ✅ Example Markdown Content (`content.en.md`)

```md
# Div Block

The `<div>` element is a container for HTML elements.

```

---

## 📜 Output JSON Example

```json
{
  "content": [
    {
      "type": "heading",
      "depth": 1,
      "children": [{ "type": "text", "value": "Div Block" }]
    },
    {
      "type": "paragraph",
      "children": [{ "type": "text", "value": "The `<div>` element is a container for HTML elements." }]
    }
  ],
  "properties": {
    "title": "Div Block",
    "description": "The HTML `<div>` tag represents a container...",
    "tags": ["html", "container"]
  }
}
```

---

## 🔖 Releasing a New Version

Releases are handled automatically using `semantic-release`.

Before publishing a new version, make sure to:

1. Commit and push all changes to the `main` branch.
2. Use commit messages that follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:
   - `feat: ...` — for new features
   - `fix: ...` — for bug fixes
   - `chore: ...`, `refactor: ...`, etc.
3. Versioning is determined automatically based on the type of commits (`patch`, `minor`, `major`).

---

## 👨‍💻 Author

Developed and maintained by [Ruslan Martynov](https://github.com/ruslan-mart)

If you have any suggestions or find a bug, feel free to open an issue or pull request.

---

## 📄 License

This package is licensed under the [MIT License](./LICENSE).
