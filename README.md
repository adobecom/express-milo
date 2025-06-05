# Milo goes to college
Use this project template to create a Milo site.

## Steps

1. Copy existing [`college`](https://adobe.sharepoint.com/:f:/r/sites/adobecom/Shared%20Documents/) content folder to your sharepoint and give helix@adobe.com View access
2. Click "[Use this template](https://github.com/adobecom/milo-college/generate)" Github button on this project.

From your newly created project

1. Install the [Helix Bot](https://github.com/apps/helix-bot/installations/new).
2. Change the fstab.yaml file to point to your content.
3. Add the project to the [Helix Sidekick](https://github.com/adobe/helix-sidekick).
4. Start creating your content.

## Developing
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `sudo npm install -g @adobe/helix-cli`
1. Run `aem up` this repo's folder. (opens your browser at `http://localhost:3000`)
1. Open this repo's folder in your favorite editor and start coding.

## Testing
```sh
npm run test
```
or:
```sh
npm run test:watch
```
This will give you several options to debug tests. Note: coverage may not be accurate.



-----
### Nala E2E UI Testing
-----

#### 1. Running Nala Tests
- Ensure you have run  `npm install` in the project root.
- You may also need to run `npx playwright install` to install all playwright browsers
- Nala tests can be executed using the following command:
  ```sh
    npm run nala <env> [options]
  ```
  ```sh
  # env: [main | stage | etc ]

  # options:
    - browser=<chrome|firefox|webkit>    # Browser to use (default: chrome)
    - device=<desktop|mobile>            # Device (default: desktop)
    - test=<.test.cjs>                   # Specific test file to run (runs all tests in the file)
    - -g, --g=<@tag>                     # Tag to filter tests by annotations ex: @test1, @ax-columns, @ax-marquee
    - mode=<headless|ui|debug|headed>    # Mode (default: headless)
    - config=<config-file>               # Configuration file (default: Playwright default)
    - project=<project-name>             # Project configuration (default: express-live-chromium)
    - milolibs=<main|stage|feat-branch|> # Milolibs?=<env> 
  ```

- Examples:

  ```sh
  - npm run nala stage @ax-columns                 # Run ax-columns block tests on express stage env on chrome browser
  - npm run nala stage @ax-columns browser=firefox # Run ax-columns block tests on express stage env on firefox browser
  - npm run nala stage milolibs=stage              # Run express tests on stage env with Milo Stage libs                                    
  ```

#### 2. Nala Help Command:
---
To view examples of how to use Nala commands with various options, you can run
```sh
npm run nala help
```

#### ⚠️ Important Note
- **Debug and UI Mode Caution**: When using `debug` or `ui` mode, it is recommended to run only a single test using annotations (e.g., `@test1`). Running multiple tests in these modes (e.g., `npm run nala stage mode=debug` or `mode=ui`) will launch a separate browser or debugger window for each test, which can quickly become resource-intensive and challenging to manage.

- **Tip**: To effectively watch or debug, focus on one test at a time to avoid opening excessive browser instances or debugger windows.

#### 3. Nala Accessiblity Testing:
---
  - Run accessibility tests using following command:

  ```sh
    - npm run a11y <env|url> [path] [options]
  ```

```sh
# env: [main | stage | branch-name | full URL]

# path: Optional relative path to append to the env or URL

# options:
  -f, --file <filePath>            # Path to a file containing multiple URLs (one per line)
  -s, --scope <scope>              # DOM scope to test (default: body)
  -t, --tags <tag1,tag2>           # WCAG tags to include (e.g., wcag2a,wcag21aa)
  -m, --max-violations <number>    # Max allowed violations before test fails (default: 0)
  -o, --output-dir <directory>     # Directory to save HTML reports (default: ./test-a11y-results)

```
- Examples:

```sh
  - npm run a11y https://adobe.com
  - npm run a11y stage /drafts/nala/blocks/ax-columns/ax-column-highlight
  - npm run a11y https://adobe.com -- -t 'wcag2a'
  - npm run a11y main -f urls.txt
```

#### 4. Nala Documentation
For detailed guides and documentation on Nala, please visit the [Nala GitHub Wiki](https://github.com/adobecom/milo/wiki/Nala#nala-introduction).
