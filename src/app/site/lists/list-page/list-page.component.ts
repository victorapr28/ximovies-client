import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {ListState} from '../state/list-state';
import {Observable} from 'rxjs';
import {List} from '../../../models/list';
import {ActivatedRoute, Router} from '@angular/router';
import {ReloadList, ResetState} from '../state/list-actions';
import {UserListsState} from '../user-lists/state/user-lists-state';
import {FormBuilder} from '@angular/forms';
import {ListItem} from '../types/list-item';
import {LIST_SORT_OPTIONS} from '../types/list-sort-options';
import {CurrentUser} from '../../../../common/auth/current-user';
import {ShareableNetworks, shareLinkSocially} from '../../../../common/core/utils/share-link-socially';
import {Settings} from '../../../../common/core/config/settings.service';
import {shareViaEmail} from '../../../../common/core/utils/share-via-email';
import {copyToClipboard} from '../../../../common/core/utils/copy-link-to-clipboard';
import {Translations} from '../../../../common/core/translations/translations.service';
import {Toast} from '../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../toast-messages';

@Component({
    selector: 'list-page',
    templateUrl: './list-page.component.html',
    styleUrls: ['./list-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPageComponent implements OnInit, OnDestroy {
    @Select(ListState.list) list$: Observable<List>;
    @Select(ListState.items) items$: Observable<ListItem[]>;
    @Select(ListState.loading) loading$: Observable<boolean>;
    @Select(ListState.totalCount) totalCount$: Observable<number>;
    @Select(ListState.currentCount) currentCount$: Observable<number>;
    @Select(ListState.public) public$: Observable<boolean>;

    public sortOptions = LIST_SORT_OPTIONS;

    public listForm = this.fb.group({
        sortBy: ['pivot.order'],
        sortDir: ['asc'],
    });

    constructor(
        private route: ActivatedRoute,
        private store: Store,
        private router: Router,
        private fb: FormBuilder,
        private currentUser: CurrentUser,
        private settings: Settings,
        private i18n: Translations,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(() => {
            this.reloadList();
            this.syncFormWithState();
        });

        this.listForm.get('sortBy').valueChanges.subscribe(value => {
            const sortDir = value === 'pivot.order' ? 'asc' : 'desc';
            this.listForm.patchValue({sortDir}, {emitEvent: false});
        });

        this.listForm.valueChanges.subscribe(() => {
            this.reloadList();
        });
    }

    ngOnDestroy() {
        this.store.dispatch(new ResetState());
    }

    public setSortDir(direction: 'desc'|'asc') {
        this.listForm.get('sortDir').setValue(direction);
    }

    public sortIsActive(direction: 'desc'|'asc'): boolean {
        return this.listForm.get('sortDir').value === direction;
    }

    public canEdit(): boolean {
        const list = this.store.selectSnapshot(ListState.list);
        return this.currentUser.get('id') === list.user_id;
    }

    private syncFormWithState() {
        const params = this.store.selectSnapshot(ListState.params);
        this.listForm.setValue(params, {emitEvent: false});
    }

    private reloadList() {
        const listId = this.route.snapshot.data.watchlist ?
            this.store.selectSnapshot(UserListsState.watchlist)?.id :
            this.route.snapshot.params.id;
        this.store.dispatch(new ReloadList(
            listId,
            this.listForm.value,
        ));
    }

    public shareListSocially(type: ShareableNetworks | 'mail' | 'copy') {
        const list = this.store.selectSnapshot(ListState.list);
        const link = this.settings.getBaseUrl(true) + 'lists/' + list.id;

        if (type === 'mail') {
            const siteName = this.settings.get('branding.site_name');
            const subject = this.i18n.t('Check out this link on ') + siteName;
            const body = `${list.name} - ${siteName} - ${link}`;
            shareViaEmail(subject, body);
        } else if (type === 'copy') {
            if (copyToClipboard(link)) {
                this.toast.open(MESSAGES.COPY_TO_CLIPBOARD_SUCCESS);
            }
        } else {
            shareLinkSocially(type, link, list.name);
        }
    }
}
