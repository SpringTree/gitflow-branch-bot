const checkGitBranchName = require( '@springtree/check-git-branch-name' );

/**
 * Checks if a pull request branch name is valid according to git flow
 *
 * @param {*} context probot handler context
 */
const checkPullRequestValid = async ( context ) => {
  const repository = context.repo();
  const { sha, ref } = context.payload.pull_request.head;
  const statusInfo = { ...repository, sha, context: 'gitflow-branch-bot' };

  // Check if valid
  //
  const valid = ref ? checkGitBranchName( { test: ref, evenReleases: false } ) : true;

  // Return status
  //
  await repository.createStatus( {
    ...statusInfo,
    state: valid ? 'success' : 'failure',
    description: `Branch ${ref} has ${valid ? 'a valid' : 'an invalid'} git branch name`,
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
