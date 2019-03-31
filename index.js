/**
 * Name validity check
 *
 * @param {*} branchName The branch name to check
 * @returns boolean
 */
const branchNameValid = ( branchName ) => {
  if (
    branchName.startsWith( 'feature/' )
    || branchName.startsWith( 'release/' )
    || branchName.startsWith( 'hotfix/' )
    || branchName.startsWith( 'experiment/' )
    || branchName.startsWith( 'fix/' )
    || branchName === 'master'
    || branchName === 'develop'
    || branchName === 'experimental'
  ) {
    return true;
  }

  return false;
};

/**
 * Checks if a pull request branch name is valid according to git flow
 *
 * @param {*} context probot handler context
 */
const checkPullRequestValid = async ( context ) => {
  const repository = context.repo();
  const pullRequest = context.issue();
  const { sha } = context.payload.pull_request.head;
  const statusInfo = { ...repository, sha, context: 'enforce-gitflow-branch-name' };

  // Check if valid
  //
  const valid = branchNameValid( pullRequest.branchName );

  // Return status
  //
  await repository.createStatus( {
    ...statusInfo,
    state: valid ? 'success' : 'failure',
    description: `Branch ${pullRequest.branchName} has ${valid ? 'a valid' : 'an invalid'} git flow branch name`,
  } );
};

/**
 * This is the main entrypoint to your Probot app
 *
 * @param {import('probot').Application} app
 */
module.exports = ( app ) => {
  // Setup check for pull request events
  //
  app.on( 'pull_request.opened', checkPullRequestValid );
  app.on( 'pull_request.synchronize', checkPullRequestValid );
};
