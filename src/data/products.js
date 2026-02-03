import productsMeta from './data.json';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const imageMap = {
  c1: require('../imgs/coffee/americano.png'),
  c2: require('../imgs/coffee/latte.png'),
  c3: require('../imgs/coffee/espresso.png'),
  c4: require('../imgs/coffee/cappucino.png'),
  c5: require('../imgs/coffee/mocha.png'),
  c6: require('../imgs/coffee/flat_white.png'),
  c7: require('../imgs/coffee/machiatto.png'),
  c8: require('../imgs/coffee/irish.png'),
  c9: require('../imgs/coffee/affogato.png'),
  c10: require('../imgs/coffee/ristretto.png'),
  c11: require('../imgs/coffee/iced_coffee.png'),
  c12: require('../imgs/coffee/cold_brew.png'),

  l1: require('../imgs/lemonade/cucumber.png'),
  l2: require('../imgs/lemonade/missu.png'),
  l3: require('../imgs/lemonade/blue.png'),
  l4: require('../imgs/lemonade/strawberry.png'),
  l5: require('../imgs/lemonade/mango.png'),
  l6: require('../imgs/lemonade/peach.png'),
  l7: require('../imgs/lemonade/kiwi.png'),
  l8: require('../imgs/lemonade/lime.png'),
  l9: require('../imgs/lemonade/watermelon.png'),

  p1: require('../imgs/foods/plain_croissant.png'),
  p2: require('../imgs/foods/choco_croissant.png'),
  p3: require('../imgs/foods/almond_croissant.png'),
  p4: require('../imgs/foods/choco_muffin.png'),
  p5: require('../imgs/foods/blueberry_muffin.png'),
  p6: require('../imgs/foods/brownies.png'),
  p7: require('../imgs/foods/cookie.png'),
  p8: require('../imgs/foods/danishes.png'),
  p9: require('../imgs/foods/doughnut.png'),
  p10: require('../imgs/foods/scones.png'),

  s1: require('../imgs/specials/frappe.png'),
  s2: require('../imgs/specials/smoothy.png'),

  m1: require('../imgs/merch/chips.png'),
  m2: require('../imgs/merch/fruit_cup.png'),
  m3: require('../imgs/merch/gift_card.png'),
  m4: require('../imgs/merch/mug.png'),
  m5: require('../imgs/merch/parfiats.png'),
  m6: require('../imgs/merch/plant.png'),
  m7: require('../imgs/merch/reusable-cups.png'),
  m8: require('../imgs/merch/tumbler.png'),
};

const PRODUCTS_BASE = productsMeta.map((p) => ({
  ...p,
  image: imageMap[p.id] || null,
}));

export const ALL_PRODUCTS = shuffleArray(PRODUCTS_BASE);

export default ALL_PRODUCTS;
