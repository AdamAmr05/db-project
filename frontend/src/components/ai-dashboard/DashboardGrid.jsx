import React from 'react';
import clsx from 'clsx';

const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12'
};

const mdColumnClasses = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
    7: 'md:grid-cols-7',
    8: 'md:grid-cols-8',
    9: 'md:grid-cols-9',
    10: 'md:grid-cols-10',
    11: 'md:grid-cols-11',
    12: 'md:grid-cols-12'
};

const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10'
};

const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12'
};

const mdSpanClasses = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    5: 'md:col-span-5',
    6: 'md:col-span-6',
    7: 'md:col-span-7',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    10: 'md:col-span-10',
    11: 'md:col-span-11',
    12: 'md:col-span-12'
};

const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6'
};

export const Grid = ({ element, children }) => {
    const props = element?.props || {};
    const columns = props.columns ?? 12;
    const gap = props.gap ?? 4;

    return (
        <div
            className={clsx(
                'grid w-full grid-cols-1',
                mdColumnClasses[columns] || columnClasses[columns] || 'md:grid-cols-12',
                gapClasses[gap] || 'gap-4'
            )}
        >
            {children}
        </div>
    );
};

export const GridItem = ({ element, children }) => {
    const props = element?.props || {};
    const span = props.span ?? 12;
    const rowSpan = props.rowSpan;

    return (
        <div
            className={clsx(
                'col-span-12',
                mdSpanClasses[span] || spanClasses[span] || 'md:col-span-12',
                rowSpan ? rowSpanClasses[rowSpan] : null
            )}
        >
            {children}
        </div>
    );
};
