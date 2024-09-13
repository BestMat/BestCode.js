// ©2024 - BestCode.js - BestMat, Inc. - All rights reserved.
export default function calc(a, b) {
    if (a >= 9 && a <= 10) {
        return a + b;
    } else if (a == 3) {
        return a;
    } else if (a == 4) {
        return a;
    } else if (a == 6) {
        return a ** b;
    } else {
        return a++;
    }
}

calc(3, 20);