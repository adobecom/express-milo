import {
  removeIrrelevantSections,
} from './utils.js';

export const DEFAULT_EXPERIMENT_OPTIONS = {
  // Generic properties
  rumSamplingRate: 10, // 1 in 10 requests

  // Audiences related properties
  audiences: {},
  audiencesMetaTagPrefix: 'audience',
  audiencesQueryParameter: 'audience',

  // Experimentation related properties
  experimentsRoot: '/experiments',
  experimentsConfigFile: 'manifest.json',
  experimentsMetaTag: 'experiment',
  experimentsQueryParameter: 'experiment',
};

function getCCEntitledUsersSegmentId() {
  const name = 'stage';
  if (name === 'prod') {
    return '2a537e84-b35f-4158-8935-170c22b8ae87';
  }
  return 'bf632803-4412-463d-83c5-757dda3224ee';
}

function getSegmentsFromAlloyResponse(response) {
  const segments = [];
  if (response && response.destinations) {
    Object.values(response.destinations).forEach((destination) => {
      if (destination.segments) {
        Object.values(destination.segments).forEach((segment) => {
          segments.push(segment.id);
        });
      }
    });
  }
  return segments;
}

// Define the custom audiences mapping for experience decisioning
export const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
  'new-visitor': () => !localStorage.getItem('franklin-visitor-returning'),
  'returning-visitor': () => !!localStorage.getItem('franklin-visitor-returning'),
  ccentitled: async () => {
    const res = await window.alloyLoader;
    const segments = getSegmentsFromAlloyResponse(res);
    return segments.includes(getCCEntitledUsersSegmentId());
  },
};

/**
 * Generates a decision policy object which is understood by UED from an
 * experiment configuration.
 * @param {*} config Experiment configuration
 * @returns Experiment decision policy object to be passed to UED.
 */
function getDecisionPolicy(config) {
  const decisionPolicy = {
    id: 'content-experimentation-policy',
    rootDecisionNodeId: 'n1',
    decisionNodes: [{
      id: 'n1',
      type: 'EXPERIMENTATION',
      experiment: {
        id: config.id,
        identityNamespace: 'ECID',
        randomizationUnit: 'DEVICE',
        treatments: Object.entries(config.variants).map(([key, props]) => ({
          id: key,
          allocationPercentage: props.percentageSplit
            ? parseFloat(props.percentageSplit) * 100
            : 100 - Object.values(config.variants).reduce((result, variant) => {
              const returnResult = result - (parseFloat(variant.percentageSplit || 0) * 100);
              return returnResult;
            }, 100),
        })),
      },
    }],
  };
  return decisionPolicy;
}

/**
 * Checks if any of the configured audiences on the page can be resolved.
 * @param {string[]} applicableAudiences a list of configured audiences for the page
 * @param {object} options the plugin options
 * @returns Returns the names of the resolved audiences, or `null` if no audience is configured
 */
export async function getResolvedAudiences(
  applicableAudiences,
  options = {
    ...DEFAULT_EXPERIMENT_OPTIONS,
    audiences: AUDIENCES,
  },
) {
  if (!applicableAudiences.length || !Object.keys(options.audiences).length) {
    return null;
  }
  // If we have a forced audience set in the query parameters (typically for simulation purposes)
  // we check if it is applicable
  const usp = new URLSearchParams(window.location.search);
  const forcedAudience = usp.has(options.audiencesQueryParameter)
    ? this.toClassName(usp.get(options.audiencesQueryParameter))
    : null;
  if (forcedAudience) {
    return applicableAudiences.includes(forcedAudience) ? [forcedAudience] : [];
  }

  // Otherwise, return the list of audiences that are resolved on the page
  const results = await Promise.all(
    applicableAudiences
      .map((key) => {
        if (options.audiences[key] && typeof options.audiences[key] === 'function') {
          return options.audiences[key]();
        }
        return false;
      }),
  );
  return applicableAudiences.filter((_, i) => results[i]);
}

/**
 * Replaces element with content from path
 * @param {string} path
 * @param {HTMLElement} element
 */
async function replaceInner(path, element) {
  const plainPath = `${path}.plain.html`;
  try {
    const resp = await fetch(plainPath);
    const html = await resp.text();
    element.innerHTML = html;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`error loading experiment content: ${plainPath}`, e);
  }
  return null;
}

export async function runExps(config, forcedExperiment, forcedVariant) {
  config.resolvedAudiences = await getResolvedAudiences(config.audience.split(',').map((a) => a.trim()));
  config.run = forcedExperiment
    || !config.resolvedAudiences
    || config.resolvedAudiences.length;

  window.hlx = window.hlx || {};
  if (config.run) {
    window.hlx.experiment = config;
    if (forcedVariant && config.variantNames.includes(forcedVariant)) {
      config.selectedVariant = forcedVariant;
    } else {
      const ued = await import('./ued/ued-0.2.0.js');
      const decision = ued.evaluateDecisionPolicy(getDecisionPolicy(config), {});
      config.selectedVariant = decision.items[0].id;
    }
    // populate ttMETA with hlx experimentation details
    window.ttMETA = window.ttMETA || [];
    const experimentDetails = {
      CampaignId: window.hlx.experiment.id,
      CampaignName: window.hlx.experiment.experimentName,
      OfferId: window.hlx.experiment.selectedVariant,
      OfferName: window.hlx.experiment.variants[window.hlx.experiment.selectedVariant].label,
    };
    window.ttMETA.push(experimentDetails);
    // add hlx experiment details as dynamic variables
    // for Content Square integration
    // eslint-disable-next-line no-underscore-dangle
    if (window._uxa) {
      for (const propName of Object.keys(experimentDetails)) {
        // eslint-disable-next-line no-underscore-dangle
        window._uxa.push(['trackDynamicVariable', { key: propName, value: experimentDetails[propName] }]);
      }
    }
    if (config.selectedVariant !== 'control') {
      const currentPath = window.location.pathname;
      const pageIndex = config.variants.control.pages.indexOf(currentPath);
      if (pageIndex >= 0) {
        const page = config.variants[config.selectedVariant].pages[pageIndex];
        if (page) {
          const experimentPath = new URL(page, window.location.href).pathname.split('.')[0];
          if (experimentPath && experimentPath !== currentPath) {
            await replaceInner(experimentPath, document.querySelector('main'));
            removeIrrelevantSections(document);
          }
        }
      }
    }
  }
}
