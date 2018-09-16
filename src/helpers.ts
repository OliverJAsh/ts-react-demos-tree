import { Option } from 'fp-ts/lib/Option';

export const unsafeGet = <T extends unknown>(option: Option<T>) =>
    option.getOrElseL(() => {
        throw new Error('Expected some but got none.');
    });

export const createSubType = <T>() => <SubType extends T>(subType: SubType) => subType;
