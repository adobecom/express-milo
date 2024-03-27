import { toClassName } from "../utils.js";

export async function fetchPlaceholders() {
    const requestPlaceholders = async (url) => {
      const resp = await fetch(url);
      if (resp.ok) {
        const json = await resp.json();
        window.placeholders = {};
        json.data.forEach((placeholder) => {
          window.placeholders[toClassName(placeholder.Key)] = placeholder.Text;
        });
      }
    };
    if (!window.placeholders) {
      try {
        const { prefix } = getConfig().locale;
        await requestPlaceholders(`${prefix}/express/placeholders.json`);
      } catch {
        await requestPlaceholders('/express/placeholders.json');
      }
    }
    return window.placeholders;
  }
  