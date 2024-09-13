// ©2024 - BestCode.js - BestMat, Inc. - All rights reserved.
export default function calc(a: number, b: number): number {
    if (a >= 9 && a <= 10) {
        return a + b;
    } else if (a == 3) {
        return a;
    } else if (a == 4) {
        return a;
    } else if (a == 6) {
        return a ** b;
    }

    return a++;
}

calc(27, 21);