import Contentstack from '@contentstack/delivery-sdk';

const Stack = Contentstack.stack({
  apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY,
  deliveryToken: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN,
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT,
  region: import.meta.env.VITE_CONTENTSTACK_REGION,
});

export default Stack;
