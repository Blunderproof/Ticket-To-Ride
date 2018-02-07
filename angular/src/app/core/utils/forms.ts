import { FormGroup, AbstractControl, FormArray } from '@angular/forms';

export function createFormArray(abstractControlObjectGraph: any[]): FormArray {
    const formArray = [];
    abstractControlObjectGraph.forEach(value => {
        if (value instanceof AbstractControl) {
            formArray.push(value);
        } else if (Array.isArray(value)) {
            formArray.push(createFormArray(value));
        } else {
            formArray.push(createFormGroup(value));
        }
    });
    return new FormArray(formArray);
}

export function createFormGroup(abstractControlObjectGraph: Object): FormGroup {
    const formGroup = {};
    Object.keys(abstractControlObjectGraph).forEach(key => {
        const value = abstractControlObjectGraph[key];
        if (value instanceof AbstractControl) {
            formGroup[key] = value;
        } else if (Array.isArray(value)) {
            formGroup[key] = createFormArray(value);
        } else {
            formGroup[key] = createFormGroup(value);
        }
    });
    return new FormGroup(formGroup);
}
