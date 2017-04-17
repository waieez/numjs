const test = require("tape");
const _ = require("../num.js");

function setup() {
  return {
    v: [1, 2],
    w: [3, 4],
    A: [[1, 2], [3, 4]],
    B: [[5, 6], [7, 8]],
    C: [[1, 2, 3]],
    D: [[1], [2], [3]]
  };
}

test("Vector Addition", function(assert) {
  const { v, w } = setup();
  assert.deepEqual(_.add(v, w), [4, 6], "Vector addition should work");
  assert.end();
});

test("Vector dot product", function(assert) {
  const { v, w } = setup();
  assert.deepEqual(_.dot(v, w), 11);
  assert.end();
});

test("isMatrix", function(assert) {
  const { v, A } = setup();
  // assert.throws(_.isMatrix(v), 'Should throw on vectors');
  // assert.throws(_.isMatrix(true), 'Should throw on arbitrary input');
  assert.ok(_.isMatrix(A), "Should work for valid matrices");
  assert.end();
});

test("isVector", function(assert) {
  const { v, A } = setup();
  // assert.throws(_.isVector(A), 'Should throw on matrix');
  // assert.throws(_.isVector(true), 'Should throw on arbitrary input');
  assert.ok(_.isVector(v), "Should work for valid vectors");
  assert.end();
});

test("shape", function(assert) {
  const { v, A } = setup();
  let shape = _.shape(v);
  assert.equal(shape.n, 2, "vectors should be represented as 2x1 matrix");
  assert.equal(shape.m, 1, "vectors should be represented as 2x1 matrix");

  shape = _.shape(A);
  assert.equal(shape.n, 2, "n of a 2x2 matrix should be 2");
  assert.equal(shape.m, 2, "m of a 2x2 matrix should be 2");
  assert.end();
});

test("multiplication, MxV", function(assert) {
  const { A, B, v } = setup();
  assert.deepEqual(
    _.multiplyMv(A, v),
    [5, 11],
    "Vector Multiplication with Matrix should work"
  );
  assert.deepEqual(
    _.multiply(A, v),
    [5, 11],
    "Vector Multiplication with Matrix should work"
  );
  assert.end();
});

test("multiplication, MxM", function(assert) {
  const { A, B, C, D } = setup();
  assert.deepEqual(
    _.multiply(A, B),
    [[19, 22], [43, 50]],
    "Matrix Multiplication with Matrix should work"
  );
  assert.deepEqual(
    _.multiply(C, D),
    [[14]],
    "Matrix Multiplication with Matrix should work"
  );
  assert.end();
});
