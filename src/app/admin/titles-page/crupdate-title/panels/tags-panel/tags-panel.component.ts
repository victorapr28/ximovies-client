import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AttachTags, DetachTag} from '../../state/crupdate-title-actions';
import {MESSAGES} from '../../../../../toast-messages';
import {Tag} from '@common/core/types/models/Tag';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {Toast} from '@common/core/ui/toast.service';
import {SelectTagsModalComponent} from '@common/tags/tags-manager/select-tags-modal/select-tags-modal.component';

@Component({
    selector: 'tags-panel',
    templateUrl: './tags-panel.component.html',
    styleUrls: ['./tags-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsPanelComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    @Input() type: 'keyword' | 'genre' | 'production_country';
    @Input() displayType: string;
    public dataSource = new MatTableDataSource();

    constructor(
        private store: Store,
        private modal: Modal,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.dataSource.sort = this.matSort;
        const tags$ = this.getTagObservable();

        tags$.subscribe(tags => {
            this.dataSource.data = tags || [];
        });
    }

    public openTagManagerModal() {
        this.modal.open(
            SelectTagsModalComponent,
            {tagType: this.type, pluralName: this.type === 'production_country' ? 'countries' : `${this.type}s`},
        ).beforeClosed().subscribe(tagNames => {
           if (tagNames && tagNames.length) {
               this.store.dispatch(new AttachTags(tagNames, this.type));
           }
        });
    }

    public detachTag(tag: Tag) {
        this.store.dispatch(new DetachTag(tag))
            .subscribe(() => {
                this.toast.open(MESSAGES.TAG_DETACH_SUCCESS);
            });
    }

    public applyFilter(value: string) {
        this.dataSource.filter = value;
    }

    private getTagObservable() {
        if (this.type === 'keyword') {
            return this.store.select(CrupdateTitleState.keywords);
        } else if (this.type === 'genre') {
            return this.store.select(CrupdateTitleState.genres);
        } else {
            return this.store.select(CrupdateTitleState.countries);
        }
    }
}
