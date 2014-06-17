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
        
        It was made to help prepere for reduced row echolon form.
 */
function sort_reduced_matrix(matrix) {
        'use strict';
        var i, j, len, has_pivot, irrelevant, positions, new_matrix, count;

        len       = {};
        len.i     = matrix.length;    // matrix length (row)
        len.j     = matrix[0].length; // vector length (column)
        positions = [];

        has_pivot = [];

        // Find nonzero positions
        for (j = 0; j < len.j; j += 1) {
                for (i = 0; i < len.i; i += 1) {
                        if (matrix[i][j] === 1 && has_pivot[i] !== i) {
                                has_pivot[i] = i;
                                positions[positions.length] = i;
                                break;
                        }
                }
        }

        irrelevant = [];
        count      = 0;

        // Find irrelevant vectors positions
        for (i = 0; i < len.i; i += 1) {
                if (has_pivot[i] === undefined) {
                        irrelevant[count] = i;
                        count += 1;
                }
        }

        new_matrix = [];
        count      = 0;

        // Sort positions
        for (i = 0; i < len.i; i += 1) {
                if (matrix[positions[i]] !== undefined) {
                        new_matrix[i] = matrix[positions[i]];
                } else {
                        new_matrix[i] = matrix[irrelevant[count]];
                        count += 1;
                }
        }

        return new_matrix;
}

function reduced_row_echolon_form(matrix) {
        'use strict';
        var i, p, tmp, len, mu, mv;

        len = {}; // Length.
        i   = {}; // Increment.
        tmp = {}; // Temporary holder.
        p   = {}; // Position.

        len.r   = matrix.length;    // Row, length.
        len.c   = matrix[0].length; // column, length.

        i.r  = 0; // Row, increment.
        i.r2 = 0; // Row2, increment.
        i.c  = 0; // Column, increment.

        tmp.v = []; // Vector, temporary holder.
        tmp.p = 0;  // pivot value.

        p.lp  = 0;  // Lead pivot, position.
        p.rpd = []; // Reserved positions direct, position.

         // Find lead pivots in matrix.
        for (i.r = 0; i.r < len.r; i.r += 1) {

                p.lp = null;
                // Get lead pivot position.
                for (i.c = 0; i.c < len.c; i.c += 1) {
                        /* If position is not reserved nor is zero, then that is
                         * our leading pivot. */
                        if (matrix[i.r][i.c] !== 0 && p.rpd[i.c] === undefined) {
                                p.lp = i.c;
                                break;
                        }
                }

                if (p.lp !== null) {
                        // Reserve lead pivot position.
                        p.rpd[p.lp] = p.lp;
                        // Reduce row such that the pivot is 1.
                        if (matrix[i.r][p.lp] !== 1) {
                                tmp.p = matrix[i.r][p.lp];
                                for (i.c = 0; i.c < len.c; i.c += 1) {
                                        matrix[i.r][i.c] /= tmp.p;
                                }
                        }
                        /* Reduce other rows (i.r2) from row (i.r). */
                        for (i.r2 = 0; i.r2 < len.r; i.r2 += 1) {
                                /* Skip row (i.r) and don't reduce if desired
                                 * value is already zero. */
                                if (i.r2 !== i.r && matrix[i.r2][p.lp] !== 0) {
                                        /* Scale row (i.r) using pivot position
                                         * from row (i.r2) as the multiplier. */
                                        for (i.c = 0; i.c < len.c; i.c += 1) {
                                                tmp.v[i.c] = matrix[i.r][i.c];
                                                tmp.v[i.c] *= matrix[i.r2][p.lp];
                                        }
                                        // Row reduction.
                                        for (i.c = 0; i.c < len.c; i.c += 1) {
                                                matrix[i.r2][i.c] -= tmp.v[i.c];
                                        }
                                }
                        }
                }
        }
        // Finally, we sort our rows, keeping zeros at the bottom and return.
        return sort_reduced_matrix(matrix);
}

// Compere this to wolframalpha.com answers.

// answer: http://www.wolframalpha.com/input/?i=solve+row+echelon+form+{{5%2C+-7%2C+-8%2C+-4}%2C{2%2C+8%2C+-22%2C+-55}%2C+{-3%2C+0%2C+-36%2C+12}}
var matrix = [
        [5, -7, -8, -4],
        [2, 8, -22, -55],
        [-3, 0, -36, 12]
];

matrix = reduced_row_echolon_form(matrix);

console.log(matrix);

// answer: http://www.wolframalpha.com/input/?i=solve+row+echelon+form+{{5%2C+-23%2C+2%2C+4%2C+5%2C+11}%2C{4%2C+-3%2C+6%2C+4%2C+5%2C+2}%2C{3%2C+7%2C+-18%2C+7%2C+9%2C+-6}%2C{4%2C+87%2C+-12%2C+7%2C+12%2C+6}%2C{5%2C+4%2C+7%2C+11%2C+7%2C+-7}}
matrix = [
        [5, -23, 2, 4, 5, 11],
        [4, -3, 6, 4, 5, 2],
        [3, 7, -18, 7, 9, -6],
        [4, 87, -12, 7, 12, 6],
        [5, 4, 7, 11, 7, -7]
];
        
matrix = reduced_row_echolon_form(matrix);
console.log(matrix[0]);
console.log(matrix[1]);
console.log(matrix[2]);
console.log(matrix[3]);
console.log(matrix[4]);

// answer: http://www.wolframalpha.com/input/?i=solve+row+echelon+form+{{1%2C+2%2C+2%2C+2}%2C{1%2C+3%2C+3%2C+3}%2C+{1%2C+4%2C+16%2C+5}}
matrix = [
        [1, 2, 2, 2],
        [1, 3, 3, 3],
        [1, 4, 16, 5]
];
        
matrix = reduced_row_echolon_form(matrix);
console.log(matrix);

// answer: http://www.wolframalpha.com/input/?i=solve+row+echelon+form+{{0%2C+2%2C+-1%2C+-6}%2C{0%2C+3%2C+-2%2C+-16}%2C+{0%2C+0%2C+-3%2C+11}}
matrix = [
        [0, 2, -1, -6],
        [0, 3, -2, -16],
        [0, 0, -3, 11]
];
        
matrix = reduced_row_echolon_form(matrix);
console.log(matrix);