import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findProduct, products, type Product } from '../src/lib/catalog';
import { money, quote } from '../src/lib/pricing';
import { applyPreset, matchesPreset, PRESETS, surpriseSetup } from '../src/lib/presets';
import {
  chooseProduct,
  initialSetup,
  lineItems,
  parseSetup,
  setQuantity,
  type Setup,
} from '../src/lib/setup';
import { setupFromSearchParams, setupToSearchParams } from '../src/lib/share-link';

const product = (id: string) => findProduct(id) as Product;

test('the default setup is priced from its desk, chair and accessories', () => {
  // $6 desk + $6 chair + $12 monitor + $1 plant
  assert.equal(quote(initialSetup).weeklyCents, 2500);
  assert.equal(lineItems(initialSetup).length, 4);
});

test('a month is billed as four weeks, matching monis.rent', () => {
  assert.equal(quote({ ...initialSetup, weeks: 4 }).totalCents, 10000);
  assert.equal(quote({ ...initialSetup, weeks: 1 }).totalCents, 2500);
});

test('stays of three months or more get 10% off every week', () => {
  const pricing = quote({ ...initialSetup, weeks: 12 });
  assert.equal(pricing.discountedWeeklyCents, 2250);
  assert.equal(pricing.totalCents, 27000);
  assert.equal(pricing.savedCents, 3000);
});

test('monitor quantity multiplies its price and stops at three', () => {
  const twoMonitors = setQuantity(initialSetup, product('monitor'), 2);
  assert.equal(quote(twoMonitors).weeklyCents, 3700);

  const tooMany = setQuantity(initialSetup, product('monitor'), 9);
  assert.equal(tooMany.accessories.monitor, 3);
});

test('choosing a desk or chair replaces it, choosing an accessory toggles it', () => {
  const newDesk = chooseProduct(initialSetup, product('dual-motor-desk'));
  assert.equal(newDesk.deskId, 'dual-motor-desk');

  const withLamp = chooseProduct(initialSetup, product('lamp'));
  assert.equal(withLamp.accessories.lamp, 1);
  assert.equal(chooseProduct(withLamp, product('lamp')).accessories.lamp, undefined);
});

test('invalid saved data is rejected', () => {
  const badSetups: unknown[] = [
    null,
    {},
    { ...initialSetup, deskId: 'monitor' },
    { ...initialSetup, chairId: 'electric-desk' },
    { ...initialSetup, accessories: { 'electric-desk': 1 } },
    { ...initialSetup, accessories: { monitor: 4 } },
    { ...initialSetup, accessories: { monitor: 0 } },
    { ...initialSetup, accessories: { lamp: 1.5 } },
    { ...initialSetup, weeks: -1 },
    { ...initialSetup, theme: 'unknown' },
    { ...initialSetup, timeOfDay: 'noon' },
  ];
  for (const bad of badSetups) assert.equal(parseSetup(bad), null);
});

test('a share link round-trips a setup exactly', () => {
  const setup: Setup = {
    ...initialSetup,
    deskId: 'mechanical-desk',
    accessories: { monitor: 3, lamp: 1 },
    weeks: 12,
    theme: 'sage',
    timeOfDay: 'night',
  };
  const params = setupToSearchParams(setup);
  assert.deepEqual(setupFromSearchParams(new URLSearchParams(params.toString())), setup);
});

test('a tampered share link is ignored', () => {
  const params = setupToSearchParams(initialSetup);
  params.set('extras', 'monitor*99');
  assert.equal(setupFromSearchParams(params), null);
  assert.equal(setupFromSearchParams(new URLSearchParams('utm_source=x')), null);
});

test('every preset is valid and recognised once applied', () => {
  for (const preset of PRESETS) {
    const applied = applyPreset(initialSetup, preset);
    assert.deepEqual(parseSetup(applied), applied);
    assert.ok(matchesPreset(applied, preset));
  }
});

test('surprise rooms are always valid', () => {
  for (const roll of [0, 0.25, 0.5, 0.75, 0.999]) {
    const setup = surpriseSetup(initialSetup, () => roll);
    assert.deepEqual(parseSetup(setup), setup);
  }
});

test('every real catalog item links to monis.rent and has sane pricing', () => {
  for (const item of products) {
    assert.ok(item.weeklyCents > 0, item.id);
    if (item.listWeeklyCents) assert.ok(item.listWeeklyCents > item.weeklyCents, item.id);
    if (item.monisPath) assert.match(item.monisPath, /^\/products\//);
  }
});

test('money drops cents only when they are zero', () => {
  assert.equal(money(2500), '$25');
  assert.equal(money(450), '$4.50');
  assert.equal(money(100000), '$1,000');
});
