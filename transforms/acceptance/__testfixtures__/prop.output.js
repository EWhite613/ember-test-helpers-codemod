import { find } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').tagName, 'DIV');
});