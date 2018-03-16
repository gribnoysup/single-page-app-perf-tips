const TEST_ROUTES = [
  {
    title: 'Landing page',
    value: '/',
  },
  {
    title: 'Catalog',
    value: '/catalog',
  },
  {
    title: 'Product description',
    value: '/product/SK-A-1718',
  },
  {
    title: 'Cart',
    value: '/cart',
  },
];

const TIMINGS = [
  {
    title: 'First Contentful Paint',
    id: 'ttfcp',
  },
  {
    title: 'First Meaningful Paint',
    id: 'ttfmp',
  },
  {
    title: 'Perceptual Speed Index',
    id: 'psi',
  },
  {
    title: 'First Visual Change',
    id: 'fv',
  },
  {
    title: 'Visually Complete 85%',
    id: 'vc85',
  },
  {
    title: 'Visually Complete 100%',
    id: 'vc100',
  },
  {
    title: 'First Interactive (vBeta)',
    id: 'ttfi',
  },
  {
    title: 'Time to Consistently Interactive (vBeta)',
    id: 'ttci',
  },
];

const NUMBER_OF_RUNS = process.env.NUMBER_OF_RUNS || 3;

module.exports = { TEST_ROUTES, NUMBER_OF_RUNS, TIMINGS };
