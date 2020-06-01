const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://s-ong-c.io/about-frontend',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logoLink: '',
    githubUrl: 'https://github.com/s-ong-c/about-frontend',
    helpUrl: '',
    tweetText: '',
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/introduction', // add trailing slash if enabled above
      '/codeblock',
    ],
    collapsedNav: [
      '/codeblock', // add trailing slash if enabled above
    ],
    frontline: false,
    ignoreIndex: true,
    title: 'about Frontend',
  },
  siteMetadata: {
    title: 'Gatsby Gitbook Boilerplate | SONGC',
    description: 'Documentation built with mdx. Powering hasura.io/learn ',
    ogImage: null,
    docsLocation: 'https://github.com/s-ong-c/about-frontend/tree/master/content',
    favicon: 'https://github.com/s-ong-c/s-ong-c.github.io/blob/master/static/favicon.ico',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Gatsby Gitbook Starter',
      short_name: 'GitbookStarter',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
