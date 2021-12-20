const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  reactStrictMode: true,
  excludeFile: (str) => /\*.{test}.(js|jsx|ts|tsx)/.test(str),
  async redirects() {
    return [
      {
        source: '/money-tracker',
        destination: '/money-tracker/project',
        permanent: true
      }
    ]
  }
}
