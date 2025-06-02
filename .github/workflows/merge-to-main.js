import {
  getLocalConfigs,
  isWithinRCP,
  pulls
} from './helpers.js';

const { addLabels, addFiles, getChecks, getReviews } = pulls;

// Run from the root of the project for local testing: node --env-file=.env .github/workflows/merge-to-main.js
const PR_TITLE = '[Release] Stage to Main';
const REQUIRED_APPROVALS = process.env.REQUIRED_APPROVALS ? Number(process.env.REQUIRED_APPROVALS) : 2;
const STAGE = 'stage';
const PROD = 'main';

// Check configuration
const CHECK_CONFIG = {
  // Checks that can be ignored (will not block merge)
  ignoreChecks: [
    'merge-to-main',  // Always ignore the merge check itself
    'aem-psi-check',  // Ignore AEM PSI check as it won't pass for a while
  ]
};

let github;
let owner;
let repo;

const hasFailingChecks = (checks) => {
  // Filter out ignored checks
  const relevantChecks = checks.filter(check => !CHECK_CONFIG.ignoreChecks.includes(check.name));
  
  // Check if any remaining checks are failing or in progress
  return relevantChecks.some(check => 
    check.conclusion === 'failure' || check.conclusion === 'in_progress'
  );
};

const commentOnPR = async (comment, prNumber) => {
  console.log(comment);
  if (process.env.LOCAL_RUN === 'true') {
    console.log(`[LOCAL MODE] Would comment on PR #${prNumber}: ${comment}`);
    return;
  }

  const { data: comments } = await github.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
  });

  const dayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const hasRecentComment = comments
    .filter(({ created_at }) => new Date(created_at) > dayAgo)
    .some(({ body }) => body === comment);
  if (hasRecentComment) return console.log('Comment exists for', prNumber);

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: comment,
  });
};

const getStageToMainPR = async () => {
  const { data } = await github.rest.pulls.list({
    owner,
    repo,
    state: 'open',
    base: PROD,
  });

  const pr = data.find(({ title }) => title === PR_TITLE);
  if (!pr) {
    console.log('No open Stage to Main PR found');
    return null;
  }

  console.log(`Found Stage to Main PR #${pr.number}: ${pr.html_url}`);
  
  // Get additional PR details
  await Promise.all([
    addLabels({ pr, github, owner, repo }),
    addFiles({ pr, github, owner, repo }),
    getChecks({ pr, github, owner, repo }),
    getReviews({ pr, github, owner, repo }),
  ]);

  return pr;
};

const mergeToMain = async (pr) => {
  const { number, title, checks, reviews } = pr;

  // Check for failing checks
  if (hasFailingChecks(checks)) {
    const failingChecks = checks
      .filter(check => check.conclusion === 'failure' || check.conclusion === 'in_progress')
      .map(check => `- ${check.name}: ${check.conclusion}`);
    
    await commentOnPR(
      `Cannot merge to main due to failing or in-progress checks:\n${failingChecks.join('\n')}`,
      number
    );
    return false;
  }

  // Check for required approvals
  const approvals = reviews.filter(({ state }) => state === 'APPROVED');
  if (approvals.length < REQUIRED_APPROVALS) {
    await commentOnPR(
      `Cannot merge to main due to insufficient approvals. Required: ${REQUIRED_APPROVALS} approvals`,
      number
    );
    return false;
  }

  try {
    if (process.env.LOCAL_RUN === 'true') {
      console.log(`[LOCAL MODE] Would merge PR #${number} to main`);
      return true;
    }

    await github.rest.pulls.merge({
      owner,
      repo,
      pull_number: number,
      merge_method: 'squash',
    });
    console.log(`Successfully merged PR #${number} to main`);
    return true;
  } catch (error) {
    await commentOnPR(`Error merging to main: ${error.message}`, number);
    return false;
  }
};

const main = async (params) => {
  github = params.github;
  owner = params.context.repo.owner;
  repo = params.context.repo.repo;
  
  console.log(`Running in ${process.env.LOCAL_RUN === 'true' ? 'LOCAL PREVIEW' : 'LIVE'} mode`);
  if (process.env.LOCAL_RUN === 'true') {
    console.log('⚠️  LOCAL PREVIEW MODE: No actual changes will be made');
  } else {
    console.log('⚠️  LIVE MODE: This will make actual changes to the repository');
  }
  
  if (isWithinRCP({ offset: process.env.MAIN_RCP_OFFSET_DAYS || 2, excludeShortRCP: true })) {
    return console.log('Stopped, within RCP period.');
  }

  try {
    const pr = await getStageToMainPR();
    if (!pr) {
      return console.log('No Stage to Main PR to process');
    }

    const success = await mergeToMain(pr);
    if (success) {
      console.log('Successfully promoted stage to main');
    } else {
      console.log('Failed to promote stage to main');
    }
  } catch (error) {
    console.error('Error in merge-to-main:', error);
  }
};

if (process.env.LOCAL_RUN) {
  const { github, context } = getLocalConfigs();
  main({
    github,
    context,
  });
}

export default main; 
