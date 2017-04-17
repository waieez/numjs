const test = require("tape");
const _ = require("../num.js");

function setup() {
  return {
    v: [1, 2],
    w: [3, 4],
    A: [[1, 2], [3, 4]],
    B: [[5, 6], [7, 8]],
    C: [[1, 2, 3]],
    D: [[1], [2], [3]],
    E: [[1, 1, 1], [1, 1, 1]]
  };
}

test("Vector Addition", assert => {
  const { v, w } = setup();
  assert.deepEqual(_.add(v, w), [4, 6], "Vector addition should work");
  assert.end();
});

test("Vector dot product", assert => {
  const { v, w } = setup();
  assert.deepEqual(_.dot(v, w), 11);
  assert.end();
});

test("isMatrix", assert => {
  const { v, A } = setup();
  // assert.throws(_.isMatrix(v), 'Should throw on vectors');
  // assert.throws(_.isMatrix(true), 'Should throw on arbitrary input');
  assert.ok(_.isMatrix(A), "Should work for valid matrices");
  assert.end();
});

test("isVector", assert => {
  const { v, A } = setup();
  // assert.throws(_.isVector(A), 'Should throw on matrix');
  // assert.throws(_.isVector(true), 'Should throw on arbitrary input');
  assert.ok(_.isVector(v), "Should work for valid vectors");
  assert.end();
});

test("shape", assert => {
  const { v, A, D } = setup();
  let shape = _.shape(v);
  assert.equal(shape.n, 2, "vectors should be represented as 2x1 matrix");
  assert.equal(shape.m, 1, "vectors should be represented as 2x1 matrix");

  shape = _.shape(A);
  assert.equal(shape.n, 2, "n of a 2x2 matrix should be 2");
  assert.equal(shape.m, 2, "m of a 2x2 matrix should be 2");

  shape = _.shape(D);
  assert.equal(shape.n, 3, "n of a 3x1 matrix should be 3");
  assert.equal(shape.m, 1, "m of a 3x1 matrix should be 1");
  assert.end();
});

test("multiplication, MxV", assert => {
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

test("multiplication, MxM", assert => {
  const { A, B, C, D, E } = setup();
  assert.deepEqual(
    _.multiply(A, B),
    [[19, 22], [43, 50]],
    "Matrix Multiplication with Matrix should work"
  );
  assert.deepEqual(
    _.multiply(C, D),
    [[14]],
    "Matrix Multiplication with Matrix should work: [1,3] x [3,1] => [1x1]"
  );
  const AE = _.multiply(A, E);
  assert.deepEqual(
    AE,
    [[3, 3, 3], [7, 7, 7]],
    "Matrix Multiplication with Matrix should work: [2x2] x [2x3] => [2x3]"
  );
  assert.deepEqual(
    _.multiply(AE, D),
    [[18], [42]],
    "Matrix Multiplication with Matrix should work: [2x2] X [2x3] x [3x1] => [2x1]"
  );
  assert.end();
});

test("transpose", assert => {
  const { A, D, E, v } = setup();
  assert.deepEqual(
    _.transpose(A),
    [[1, 3], [2, 4]],
    "Transpose should work: [2x2] => [2x2]"
  );
  assert.deepEqual(
    _.transpose(D),
    [[1, 2, 3]],
    "Transpose should work: [3x1] => [1x3]"
  );
  assert.deepEqual(
    _.transpose(E),
    [[1, 1], [1, 1], [1, 1]],
    "Transpose should work: [2x3] => [3x2]"
  );
  assert.deepEqual(
    _.transpose(v),
    [[1], [2]],
    "Transpose should work on vectors: [1x2] => [2x1]"
  );
  assert.end();
});
