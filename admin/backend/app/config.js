module.exports = {
  s3: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    bucket: process.env.S3_BUCKET,
    webUrl: process.env.S3_BUCKET_URL,
  },
  seed: {
    default: false,
    capabilities: false,
    regions: false,
    settings: false,
    systemEmail: false,
    page: false,
  },
  uploadPath: {
    products: 'express/products/',
    categories: 'express/categories/',
    options: 'express/options/',
    banners: 'express/banners/',
    profile: 'express/profile/',
  },
  modules: [
    {
      name: 'Category',
      id: 'category',
      fields: ['add', 'update', 'list', 'delete'],
    },
    {
      name: 'Customer',
      id: 'customer',
      fields: ['add', 'update', 'list', 'delete'],
    },
    {
      name: 'Brand',
      id: 'brand',
      fields: ['add', 'update', 'list', 'delete'],
    },
    {
      name: 'Capabilities',
      id: 'capabilities',
      fields: ['add', 'list', 'delete'],
    },
    {
      name: 'ContactUs',
      id: 'contactUs',
      fields: ['list'],
    },
    {
      name: 'Page',
      id: 'page',
      fields: ['add', 'update', 'list'],
    },
    {
      name: 'Product',
      id: 'product',
      fields: ['add', 'update', 'list', 'delete'],
    },
    {
      name: 'Roles',
      id: 'roles',
      fields: ['update', 'list'],
    },
    {
      name: 'Setting',
      id: 'setting',
      fields: ['update', 'list'],
    },
    {
      name: 'Faq',
      id: 'faq',
      fields: ['add', 'update', 'list', 'delete'],
    },
    {
      name: 'SystemEmails',
      id: 'systemEmails',
      fields: ['update', 'list'],
    },
    {
      name: 'User',
      id: 'user',
      fields: ['add', 'update', 'list', 'delete'],
    },
  ],
  changePasswordPath: '/reset-password/',
  setPasswordPath: '/set-password/',
  setAgentPasswordPath: '/agent/set-password/',
  setSubAgentPasswordPath: '/sub-agents/set-password/',
  serviceProviderPath: '/service-provider/',
  userPath: '/users/',
  agentPath: '/agents/',
  customerVerificationPath: '/users/verify-email/',
};
