const assert = require("assert");

module.exports = {
  add(v, w) {
    this._vectorsAreCompatible(v, w);
    return v.map((el, idx) => el + w[idx]);
  },
  dot(v, w) {
    this._vectorsAreCompatible(v, w);
    return v
      .map((el, idx) => {
        return el * w[idx];
      })
      .reduce((sum, val) => sum + val, 0);
  },
  multiplyMv(M, v) {
    assert.ok(this.isMatrix(M), "First arg to multiplyMv must be a matrix");
    const { m } = this.shape(M);
    const { n } = this.shape(v);
    assert.equal(m, n, "Dimensions of M and v must be compatible");
    return M.map(row => this.dot(row, v));
  },
  multiply(B, A) {
    assert.ok(this.isMatrix(B), "First arg to multiply must be a matrix");
    const isVector = this.isVector(A);
    const isMatrix = this.isMatrix(A);
    assert.ok(
      isVector || isMatrix,
      "Second arg to multiply must be a vector or a matrix"
    );
    if (isVector) {
      return this.multiplyMv(B, A);
    }
    const { m } = this.shape(B);
    const { n } = this.shape(A);
    assert.equal(m, n, "Dimensions of A and B must be compatible");
    // const out = this.colMap(A, (v, idx) => this.multiplyMv(B, v));
    // return this.colMap(out, row => row);
    // the above is way easier to reason about than:
    const self = this;
    return B.map(row => {
      const slice = [];
      self.colEach(A, (val, r, c) => {
        if (!slice[c]) {
          slice[c] = 0;
        }
        // return a matrix where the column of each row is the dot product of B.row & A.col
        slice[c] += val * row[r];
      });
      return slice;
    });
  },
  colEach(M, cb) {
    assert.ok(this.isMatrix(M), "First arg to colMap must be a Matrix");
    assert.ok(cb, "Second arg to colMap must be a callback");
    const { n, m } = this.shape(M);
    for (var col = 0; col < m; col++) {
      for (var row = 0; row < n; row++) {
        cb(M[row][col], row, col);
      }
    }
  },
  colMap(M, cb) {
    assert.ok(this.isMatrix(M), "First Arg to colMap must be a Matrix");
    assert.ok(cb, "Second arg to colMap must be a callback");
    const { n, m } = this.shape(M);
    var out = [];
    for (var col = 0; col < m; col++) {
      let slice = [];
      for (var row = 0; row < n; row++) {
        slice.push(M[row][col]);
      }
      out.push(cb(slice, col));
    }
    return out;
  },
  isMatrix(M) {
    return Array.isArray(M) && M.length > 0 && Array.isArray(M[0]);
  },
  isVector(v) {
    return Array.isArray(v) && !Array.isArray(v[0]);
  },
  _vectorsAreCompatible(v, w) {
    assert.ok(this.isVector(v));
    assert.ok(this.isVector(w));
    assert.equal(v.length, w.length);
  },
  shape(M) {
    const isVector = this.isVector(M);
    const isMatrix = this.isMatrix(M);
    assert.ok(
      isMatrix || isVector,
      "Can not determine shape of non-Matrix/non-Vector"
    );
    if (isMatrix) {
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
};
