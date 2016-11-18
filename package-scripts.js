module.exports = {
  scripts: {
    commit: {
      description: 'This uses commitizen to help us generate well formatted commit messages',
      script: 'git-cz',
    },
    test: {
      default: `jest --coverage`,
      watch: 'jest --watch',
    },
    build: {
      description: 'run all builds in parallel',
      default: 'nps --parallel build.main,build.umd,build.umd.min',
      main: {
        description: 'delete the dist directory and run babel to build the files',
        script: 'rimraf dist && babel --copy-files --out-dir dist --ignore *.test.js,webpack-entry.js src',
      },
      umd: {
        description: 'build',
        default: 'webpack --output-filename index.umd.js',
        min: {
          description: 'create a umd build that is minified',
          script: 'webpack --output-filename index.umd.min.js -p',
        },
      },
    },
    lint: {
      description: 'lint the entire project',
      script: 'eslint .',
    },
    reportCoverage: {
      description: 'Report coverage stats to codecov. This should be run after the `test` script',
      script: 'codecov',
    },
    release: {
      description: 'We automate releases with semantic-release. This should only be run on travis',
      script: 'semantic-release pre && npm publish && semantic-release post',
    },
    validate: {
      description: 'This runs several scripts to make sure things look good before committing or on clean install',
      script: 'p-s -p lint,build,test',
    },
    addContributor: {
      description: 'When new people contribute to the project, run this',
      script: 'all-contributors add',
    },
    generateContributors: {
      description: 'Update the badge and contributors table',
      script: 'all-contributors generate',
    },
  },
  options: {
    silent: false,
  },
}
