import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialSetup, parseSetup, quote, selectedProducts } from '../src/lib/catalog';
test('default estimate includes exactly the selected desk, chair and accessories',()=>{assert.equal(quote(initialSetup).total,950000);assert.equal(selectedProducts(initialSetup).length,4);});
test('three and six month discounts apply to every rental month',()=>{assert.deepEqual(quote({...initialSetup,months:3}),{monthly:950000,discount:.1,discountedMonthly:855000,total:2565000});assert.equal(quote({...initialSetup,months:6}).total,4845000);});
test('removing accessories and changing the desk recalculates the estimate',()=>{assert.equal(quote({...initialSetup,desk:'standing',accessories:[]}).total,850000);});
test('persisted data rejects invalid products, durations, themes and category substitutions',()=>{for(const bad of [null,{}, {...initialSetup,desk:'monitor'},{...initialSetup,accessories:['oak']},{...initialSetup,months:-1},{...initialSetup,theme:'unknown'}])assert.equal(parseSetup(bad),null);});
test('saved accessories are deduplicated',()=>{assert.deepEqual(parseSetup({...initialSetup,accessories:['plant','plant']})?.accessories,['plant']);});
