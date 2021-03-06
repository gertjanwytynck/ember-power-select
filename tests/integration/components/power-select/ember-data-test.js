import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import { typeInSearch, clickTrigger } from '../../../helpers/ember-power-select';
import { startMirage } from '../../../../initializers/ember-cli-mirage';
import emberDataInitializer from '../../../../initializers/ember-data';
import { nativeMouseDown } from '../../../helpers/ember-power-select';

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Ember-data integration)', {
  integration: true,
  beforeEach() {
    let owner = Ember.getOwner(this);
    this.server = startMirage({ environment: 'test', modulePrefix: 'dummy' });

    emberDataInitializer.initialize(owner);
    this.store = owner.lookup('service:store');
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('Passing as options of a `store.findAll` works', function(assert) {
  server.createList('user', 10);
  this.users = this.store.findAll('user');
  this.render(hbs`
    {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
      {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');

  return wait().then(function() {
    assert.equal($('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
    typeInSearch('2');
    assert.equal($('.ember-power-select-option').length, 1, 'Filtering works');
  });
});

test('Passing as options the result of `store.query` works', function(assert) {
  server.createList('user', 10);
  this.users = this.store.query('user', { foo: 'bar' });
  this.render(hbs`
    {{#power-select options=users searchField="name" onchange=(action (mut foo)) as |option|}}
      {{option.name}}
    {{/power-select}}
  `);

  clickTrigger();
  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');

  return wait().then(function() {
    assert.equal($('.ember-power-select-option').length, 10, 'Once the collection resolves the options render normally');
    typeInSearch('2');
    assert.equal($('.ember-power-select-option').length, 1, 'Filtering works');
  });
});

test('Delete an item in a multiple selection', function(assert) {
  server.createList('user', 10);
  this.users = this.store.findAll('user');
  this.render(hbs`
    {{#power-select-multiple options=users searchField="name" selected=users onchange=(action (mut users)) as |option|}}
      {{option.name}}
    {{/power-select-multiple}}
  `);

  return wait().then(function() {
    nativeMouseDown('.ember-power-select-multiple-remove-btn:first');
    assert.equal($('.ember-power-select-multiple-remove-btn').length, 9, 'Once the collection resolves the options render normally');
  });
});
