/*
 * Maimai-Alias-Querier -> review.ts
 * (c) 2022 Lingrottin
 * License: MIT License
 */
import { getSubmits, acceptSubmit, rejectSubmit } from './submit'
import { reviewStatus } from './types';

export function reviewSubmit(status:reviewStatus, index:number) {
    var submits = getSubmits();
    if (index >= submits.length || index < 0) {
        throw new RangeError("Index is out of range");
    } else if (!index.toString().match(/^[0-9]$/)) {
        throw new TypeError("Index must be an integer");
    }
    switch (status) {
        case 'accepted':
            acceptSubmit(index);
            break;
        case 'rejected':
            rejectSubmit(index);
            break;
    }
}

export function validateReviewPost(resource: { index: number, accept: string }) {
    var submits = getSubmits();
    if (resource.index >= submits.length || resource.index < 0) {
        return false;
    } else if (!resource.index.toString().match(/^[0-9]$/)) {
        return false;
    } else if (!((resource.accept == 'rejected') || (resource.accept == 'accepted'))) {
        return false;
    }
    return true;
}