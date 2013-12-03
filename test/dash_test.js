(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#dash', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').find('.slider-wrap');
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.dash(), this.elems, 'should be chainable');
  });

  test('nav and controls are present', function() {
    expect(2);
    this.elems.dash();
    ok(this.elems.find('.dash-nav'), 'nav should exist');
    ok(this.elems.find('.dash-controls'), 'controls should exist');
  });

  test('should be able to change classes', function() {
    expect(4);
    this.elems.dash({
      navWrapClass: 'test-nav',
      navItemClass: 'test-nav-item',
      controlsWrapClass: 'test-controls',
      controlsLeftClass: 'test-controls-left'
    });
    ok(this.elems.find('.test-nav'), 'should be able to change navWrapClass value');
    ok(this.elems.find('.test-nav-item'), 'should be able to change navItemclass value');
    ok(this.elems.find('.test-controls'), 'should be able to change controlsWrapClass value');
    ok(this.elems.find('.test-controls-left'), 'should be able to change controlsLeftClass value');

  });

  test('number of slides and nav bullets should be the same', function() {
    expect(1);
    this.elems.dash();
    strictEqual(this.elems.find('li').length, this.elems.find('.dash-nav span').length, 'should equal the same');
  });

}(jQuery));
