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
1. Run `hlx up` this repo's folder. (opens your browser at `http://localhost:3000`)
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
