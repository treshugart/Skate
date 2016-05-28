import helperElement from '../../lib/element';
import helperFixture from '../../lib/fixture';
import skate, { emit, fragment, init } from '../../../src/index';

describe('lifecycle/events', function () {
  var numTriggered;
  var tag;

  function increment () {
    ++numTriggered;
  }

  beforeEach(function () {
    numTriggered = 0;
    tag = helperElement();
  });

  it('events on own element', function () {
    skate(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    emit(myEl, 'test');
    expect(numTriggered).to.equal(1);
  });

  it('events on child elements', function () {
    skate(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    helperFixture(myEl);
    myEl.appendChild(document.createElement('span'));
    emit(myEl.children[0], 'test');
    expect(numTriggered).to.equal(1);
  });

  it('events on descendant elements', function () {
    skate(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    helperFixture(myEl);
    myEl.appendChild(document.createElement('span'));
    emit(myEl.children[0], 'test');
    expect(numTriggered).to.equal(1);
  });

  it('should allow you to re-add the element back into the DOM', function () {
    skate(tag.safe, {
      events: {
        test: increment
      }
    });

    var myEl = tag.create();
    document.body.appendChild(myEl);
    var par = myEl.parentNode;

    par.removeChild(myEl);
    par.appendChild(myEl);
    emit(myEl, 'test');
    expect(numTriggered).to.equal(1);
  });

  it('should support delegate event selectors', function () {
    skate(tag.safe, {
      events: {
        test (elem, e) {
          increment();
          expect(elem.tagName).to.equal(tag.safe.toUpperCase(), 'test');
          expect(e.target.tagName).to.equal('SPAN', 'test');
          expect(e.currentTarget.tagName).to.equal(tag.safe.toUpperCase(), 'test');
          expect(e.delegateTarget.tagName).to.equal(tag.safe.toUpperCase(), 'test');
        },
        'test a' (elem, e) {
          increment();
          expect(elem.tagName).to.equal(tag.safe.toUpperCase(), 'test a');
          expect(e.target.tagName).to.equal('SPAN', 'test a');
          expect(e.currentTarget.tagName).to.equal('A', 'test a');
          expect(e.delegateTarget.tagName).to.equal(tag.safe.toUpperCase(), 'test a');
        },
        'test span' (elem, e) {
          increment();
          expect(elem.tagName).to.equal(tag.safe.toUpperCase(), 'test span');
          expect(e.target.tagName).to.equal('SPAN', 'test span');
          expect(e.currentTarget.tagName).to.equal('SPAN', 'test span');
          expect(e.delegateTarget.tagName).to.equal(tag.safe.toUpperCase(), 'test span');
        }
      }
    });

    const frag = fragment(`<${tag.safe}><a><span></span></a></${tag.safe}>`);
    emit(frag.querySelector('span'), 'test');
    expect(numTriggered).to.equal(3);
  });

  it('should support delegate blur and focus events', function () {
    var blur = false;
    var focus = false;
    var { safe: tagName } = helperElement('my-component');

    skate(tagName, {
      created: function (elem) {
        elem.innerHTML = '<input>';
      },
      events: {
        'blur input': () => blur = true,
        'focus input': () => focus = true
      },
      prototype: {
        blur: function () {
          emit(this.querySelector('input'), 'blur');
        },
        focus: function () {
          emit(this.querySelector('input'), 'focus');
        }
      }
    });

    var inst = helperFixture(`<${tagName}></${tagName}>`).querySelector(tagName);
    init(inst);

    inst.blur();
    expect(blur).to.equal(true);

    inst.focus();
    expect(focus).to.equal(true);
  });
});