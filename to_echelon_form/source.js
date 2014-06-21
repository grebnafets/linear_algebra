/*jslint browser: true, indent: 8 */
/*global console */

copyMatrix = function(matrix) {
        'use strict';
        var r, c, len, copy;

        r   = 0; // row
        c   = 0; // col
        len = {};
        len.r = matrix.length;
        len.c = matrix[0].length;

        copy = [];

        for (r = 0; r < len.r; r += 1) {
                copy[r] = [];
                for (c = 0; c < len.c; c += 1) {
                        copy[r] = matrix[r].slice(0);
                }
        }

        return copy;
};

/*
        Sorts matrix like from something like this:
                [
                        [0, 0, 0],
                        [0, 0, 0],
                        [0, 2, 1],
                        [0, 1, 3],
                        [1, 2, 3],
                        [0, 0, 3]
                ]
        to this:
                [
                        [1, 2, 3],
                        [0, 1, 3],
                        [0, 2, 1],
                        [0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 3]
                ]

        The reason why the [0, 0, 3] is last is because
        the vector has the length of 3, so only
        3 vectors are sorted and the rest (irrelevent vectors) are appended
        later.
 */
function leadingPivotsToTop(matrix) {
        'use strict';
        var r, c, len, has_pivot, irrelevant, positions, new_matrix, count;

        len = {
                row: matrix.length,
                col: matrix[0].length
        };
        positions  = [];
        has_pivot  = [];
        irrelevant = [];
        new_matrix = [];
        count      = 0;

        // Find pivot positions
        for (c = 0; c < len.col; c += 1) {
                for (r = 0; r < len.row; r += 1) {
                        if (matrix[r][c] === 1 && has_pivot[r] !== r) {
                                has_pivot[r] = r;
                                positions[positions.length] = r;
                                break;
                        }
                }
        }

        // Find irrelevant vectors positions
        for (r = 0; r < len.row; r += 1) {
                if (has_pivot[r] === undefined) {
                        irrelevant[irrelevant.length] = r;
                        count += 1;
                }
        }

        count = 0;

        // Sort positions
        for (r = 0; r < len.row; r += 1) {
                if (matrix[positions[r]] !== undefined) {
                        new_matrix[r] = matrix[positions[r]];
                } else {
                        new_matrix[r] = matrix[irrelevant[count]];
                        count += 1;
                }
        }

        return new_matrix;
}

function reduced_row_echolon_form(matrix) {
        'use strict';
        var i, p, tmp, len, mtx;
        
        mtx = copyMatrix(matrix);
        
        len = {}; // Length.
        i   = {}; // Increment.
        tmp = {}; // Temporary holder.
        p   = {}; // Position.

        len.r = mtx.length;    // Row, length.
        len.c = mtx[0].length; // column, length.

        i.lr  = 0; // Lead row, increment.
        i.rtr = 0; // row to reduce, increment.
        i.c   = 0;  // Column, increment.

        tmp.v = []; // Vector, temporary holder.
        tmp.p = 0;  // Current pivot value, temporary holder.

        p.lp = 0;  // Lead pivot, position.
        p.rl = [];  // Reserved lead, position.

         // Find lead pivots in matrix.
        for (i.lr = 0; i.lr < len.r; i.lr += 1) {

                p.lp = null;
                // Get lead pivot position.
                for (i.c = 0; i.c < len.c; i.c += 1) {
                        /* If position is not reserved nor is zero, then that is
                         * our leading pivot. */
                        if (mtx[i.lr][i.c] !== 0 && p.rl[i.c] === undefined) {
                                p.lp = i.c;
                                break;
                        }
                }

                if (p.lp !== null) {
                        // Reserve lead pivot position.
                        p.rl[p.lp] = p.lp;
                        // Reduce row such that the pivot is 1.
                        if (mtx[i.lr][p.lp] !== 1) {
                                tmp.p = mtx[i.lr][p.lp];
                                for (i.c = 0; i.c < len.c; i.c += 1) {
                                        mtx[i.lr][i.c] /= tmp.p;
                                }
                        }
                        /* Reduce other rows (i.r2) from row (i.r). */
                        for (i.rtr = 0; i.rtr < len.r; i.rtr += 1) {
                                /* Skip row (i.r) and don't reduce if desired
                                 * value is already zero. */
                                if (i.rtr !== i.lr && mtx[i.rtr][p.lp] !== 0) {
                                        /* Scale row (i.r) using pivot position
                                         * from row (i.r2) as the multiplier. */
                                        for (i.c = 0; i.c < len.c; i.c += 1) {
                                                tmp.v[i.c] = mtx[i.lr][i.c];
                                                tmp.v[i.c] *= mtx[i.rtr][p.lp];
                                        }
                                        // Row reduction.
                                        for (i.c = 0; i.c < len.c; i.c += 1) {
                                                mtx[i.rtr][i.c] -= tmp.v[i.c];
                                        }
                                }
                        }
                }
        }
        // Finally, we sort our rows, having leads at top and return.
        return leadingPivotsToTop(mtx);
}

function compere_matrices(matrix_a, matrix_b) {
        'use strict';
        var i, j, len;

        if (matrix_a.length !== matrix_b.length) {
                return false;
        }

        len = {};

        len.i = matrix_a.length;

        for (i = 0; i < len.i; i += 1) {
                if (matrix_a[i].length !== matrix_b[i].length) {
                        return false;
                }

                len.j = matrix_a[i].length;

                for (j = 0; j < len.j; j += 1) {
                        if (matrix_a[i][j] !== matrix_b[i][j]) {
                                return false;
                        }
                }
        }

        return true;
}


// Tests.
var m = [
        [5, -7, -8, -4],
        [2, 8, -22, -55],
        [-3, 0, -36, 12]
];
// answer: http://www.wolframalpha.com/input/?i=solve+row+echelon+form+{{5%2C+-7%2C+-8%2C+-4}%2C{2%2C+8%2C+-22%2C+-55}%2C+{-3%2C+0%2C+-36%2C+12}}
var mr = [
        [1, 0, 0, -6.785219399538105],
        [0, 1, 0, -4.54041570438799],
        [0, 0, 1, 0.23210161662817538]
];

console.log(" ");
console.log("reduced_row_echolon_form test:         " + compere_matrices(reduced_row_echolon_form(m), mr));

// answer: http://www.wolframalpha.com/input/?i=solve+row+echelon+form+{{5%2C+-23%2C+2%2C+4%2C+5%2C+11}%2C{4%2C+-3%2C+6%2C+4%2C+5%2C+2}%2C{3%2C+7%2C+-18%2C+7%2C+9%2C+-6}%2C{4%2C+87%2C+-12%2C+7%2C+12%2C+6}%2C{5%2C+4%2C+7%2C+11%2C+7%2C+-7}}
var m = [
        [5, -23, 2, 4, 5, 11],
        [4, -3, 6, 4, 5, 2],
        [3, 7, -18, 7, 9, -6],
        [4, 87, -12, 7, 12, 6],
        [5, 4, 7, 11, 7, -7]
];

var mr = [
        [1, 0, 0, 0, 0, 10.784116921993304],
        [0, 1, 0, 0, 0, 0.3085998347488045],
        [0, 0, 1, 0, 0, -1.0969699432456959],
        [0, 0, 0, 1, 0, -1.369593780053366],
        [0, 0, 0, 0, 1, -5.630094680807834]
];

console.log(" ");
console.log("reduced_row_echolon_form test:         " + compere_matrices(reduced_row_echolon_form(m), mr));

// answer: http://www.wolframalpha.com/input/?i=solve+row+echelon+form+{{1%2C+2%2C+2%2C+2}%2C{1%2C+3%2C+3%2C+3}%2C+{1%2C+4%2C+16%2C+5}}
m = [
        [1, 2, 2, 2],
        [1, 3, 3, 3],
        [1, 4, 16, 5]
];

mr = [
        [1, 0, 0, 0],
        [0, 1, 0, 0.9166666666666666],
        [0, 0, 1, 0.08333333333333333]
];

console.log(" ");
console.log("reduced_row_echolon_form test:         " + compere_matrices(reduced_row_echolon_form(m), mr));

// answer: http://www.wolframalpha.com/input/?i=solve+row+echelon+form+{{0%2C+2%2C+-1%2C+-6}%2C{0%2C+3%2C+-2%2C+-16}%2C+{0%2C+0%2C+-3%2C+11}}
m = [
        [0, 2, -1, -6],
        [0, 3, -2, -16],
        [0, 0, -3, 11]
];

mr = [
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
];

console.log(" ");
console.log("reduced_row_echolon_form test:         " + compere_matrices(reduced_row_echolon_form(m), mr));