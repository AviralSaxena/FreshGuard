import images from './images';

export default [
  {
    id: '1',
    productName: 'Milk',
    addDate: '2024-02-01', // Date when added
    expirationDate: '2024-02-10', // Expiry date
    image: images.milk, 
    percentageToExpire: 80, // How much time has passed
  },
  {
    id: '2',
    productName: 'Eggs',
    addDate: '2024-01-28',
    expirationDate: '2024-02-15',
    image: images.eggs,
    percentageToExpire: 50,
  },
  {
    id: '3',
    productName: 'Cheese',
    addDate: '2024-01-25',
    expirationDate: '2024-02-05',
    image: images.cheese,
    percentageToExpire: 90,
  },
  {
    id: '4',
    productName: 'Apples',
    addDate: '2024-02-02',
    expirationDate: '2024-02-12',
    image: images.apples,
    percentageToExpire: 60,
  },
  {
    id: '5',
    productName: 'Chicken Breast',
    addDate: '2024-01-30',
    expirationDate: '2024-02-07',
    image: images.chicken,
    percentageToExpire: 75,
  },
];
