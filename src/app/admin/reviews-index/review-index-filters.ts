import {DataTableFilter} from '@common/shared/data-table/filter-panel/data-table-filters';
import {SelectUserInputComponent} from '@common/core/ui/select-user-input/select-user-input/select-user-input.component';
import {SelectTitleInputComponent} from '../video-index/select-title-input/select-title-input.component';

export const REVIEW_INDEX_FILTERS: DataTableFilter[] = [
    {
        name: 'Type',
        column: 'body',
        type: 'select',
        options: [
            {name: 'all'},
            {name: 'review'},
            {name: 'rating'}
        ]
    },
    {
        name: 'user',
        column: 'user_id',
        component: SelectUserInputComponent,
        type: 'custom',
    },
    {
        name: 'title',
        column: 'titleId',
        component: SelectTitleInputComponent,
        type: 'custom',
    },
    {
        name: 'season',
        column: 'season',
        type: 'hidden',
    },
    {
        name: 'episode',
        column: 'episode',
        type: 'hidden',
    },
];
