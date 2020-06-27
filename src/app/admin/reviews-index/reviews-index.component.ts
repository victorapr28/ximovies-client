import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Paginator} from '@common/shared/paginator.service';
import {Settings} from '@common/core/config/settings.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {Review} from '../../models/review';
import {ReviewService} from '../../site/shared/review.service';
import {REVIEW_INDEX_FILTERS} from './review-index-filters';
import {CrupdateReviewModalComponent} from '../../site/reviews/crupdate-review-modal/crupdate-review-modal.component';

@Component({
    selector: 'reviews-index',
    templateUrl: './reviews-index.component.html',
    styleUrls: ['./reviews-index.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Paginator],
})
export class ReviewsIndexComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Review>;

    constructor(
        public paginator: Paginator<Review>,
        private reviews: ReviewService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Review>({
            uri: 'reviews',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            filters: REVIEW_INDEX_FILTERS,
            staticParams: {
                with: ['user', 'reviewable'],
            }
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public openCrupdateReviewModal(review?: Review) {
        this.modal.open(CrupdateReviewModalComponent, {review})
            .afterClosed()
            .subscribe(() => {
                this.dataSource.reset();
            });
    }

    public deleteSelectedReviews() {
        const ids = this.dataSource.getSelectedItems();
        this.reviews.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.selectedRows.clear();
        });
    }

    public maybeDeleteSelectedReviews() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Reviews',
            body:  'Are you sure you want to delete selected reviews?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedReviews();
        });
    }
}
