const assert = require("assert");

module.exports = {
  add,
  dot,
  multiply,
  scale,
  transpose,

  // helpers
  isMatrix,
  isVector,
  shape
};

function add(v, w) {
  vectorsAreCompatible(v, w);
  return v.map((el, idx) => el + w[idx]);
}

function dot(v, w) {
  vectorsAreCompatible(v, w);
  return v
    .map((el, idx) => {
      return el * w[idx];
    })
    .reduce((sum, val) => sum + val, 0);
}

function multiply(B, A) {
  assert.ok(isMatrix(B), "First arg to multiply must be a matrix");
  const isV = isVector(A);
  const isM = isMatrix(A);
  assert.ok(isV || isM, "Second arg to multiply must be a vector or a matrix");
  if (isV) {
    return scale(B, A);
  }
  const { m } = shape(B);
  const { n } = shape(A);
  assert.equal(m, n, "Dimensions of A and B must be compatible");
  // const out = colMap(A, (v, idx) => multiplyMv(B, v));
  // return transpose(out);
  // the above is way easier to reason about than:
  return B.map(row => {
    const slice = [];
    colEach(A, (val, r, c) => {
      if (!slice[c]) {
        slice[c] = 0;
      }
      // return a matrix where the column of each row is the dot product of B.row & A.col
      slice[c] += val * row[r];
    });
    return slice;
  });
}

function scale(M, scalar) {
  if (isVector(M)) {
    assert.ok(!isVector(scalar), "Vector scalars must be constant values");
    return M.map(val => val * scalar);
  }
  const isM = isMatrix(M);
  assert.ok(isM, "First argument to scale must be a Matrix or Vector");
  if (isVector(scalar)) {
    const { m } = shape(M);
    const { n } = shape(scalar);
    assert.equal(m, n, "Dimensions of M and scalar vector must be compatible");
    return M.map(row => dot(row, scalar));
  }
  return M.map(row => scale(row, scalar));
}

function transpose(M) {
  if (!isMatrix(M) && isVector(M)) {
    M = [M];
  }
  return colMap(M, col => col);
}

// HELPERS
function colEach(M, cb) {
  assert.ok(isMatrix(M), "First arg to colMap must be a Matrix");
  assert.ok(cb, "Second arg to colMap must be a callback");
  const { n, m } = shape(M);
  for (var col = 0; col < m; col++) {
    for (var row = 0; row < n; row++) {
      cb(M[row][col], row, col);
    }
  }
}

function colMap(M, cb) {
  assert.ok(isMatrix(M), "First Arg to colMap must be a Matrix");
  assert.ok(cb, "Second arg to colMap must be a callback");
  const { n, m } = shape(M);
  var out = [];
  for (var col = 0; col < m; col++) {
    let slice = [];
    for (var row = 0; row < n; row++) {
      slice.push(M[row][col]);
    }
    out.push(cb(slice, col));
  }
  return out;
}

function isMatrix(M) {
  return Array.isArray(M) && M.length > 0 && Array.isArray(M[0]);
}

function isVector(v) {
  return Array.isArray(v) && !Array.isArray(v[0]);
}

function shape(M) {
  const isV = isVector(M);
  const isM = isMatrix(M);
  assert.ok(isM || isV, "Can not determine shape of non-Matrix/non-Vector");
  if (isM) {
    // only handle 2d matrix for now
    return {
      n: M.length,
      m: M[0].length
    };
  }
  return {
    n: M.length,
    m: 1
  };
}

function vectorsAreCompatible(v, w) {
  assert.ok(isVector(v));
  assert.ok(isVector(w));
  assert.equal(v.length, w.length);
}
