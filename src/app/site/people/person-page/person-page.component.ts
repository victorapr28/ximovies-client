import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {PersonState} from '../state/person-state';
import {BehaviorSubject, Observable} from 'rxjs';
import {Person} from '../../../models/person';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {Title} from '../../../models/title';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Episode} from '../../../models/episode';
import {LoadFullTitleCredits} from '../state/person-state-actions';
import {finalize} from 'rxjs/operators';

interface CreditPivot {
    department: string;
    character: string;
    job: string;
}

interface TitleCredit extends Title {
    credited_episode_count: number;
    pivot: CreditPivot;
    episodes: (Episode & {pivot: CreditPivot})[];
}

@Component({
    selector: 'person-page',
    templateUrl: './person-page.component.html',
    styleUrls: ['./person-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonPageComponent implements OnInit {
    @Select(PersonState.person) person$: Observable<Person>;
    @Select(PersonState.credits) credits$: Observable<{[key: string]: TitleCredit[]}>;
    @Select(PersonState.knownFor) knownFor$: Observable<Title[]>;
    @Select(PersonState.backdrop) backdrop$: Observable<string>;
    @Select(PersonState.creditsCount) creditsCount$: Observable<number>;

    public loadingAdditionalCredits$ = new BehaviorSubject(false);

    constructor(
        public urls: TitleUrlsService,
        private store: Store,
        private route: ActivatedRoute,
        private viewportScroller: ViewportScroller,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(() => {
            this.viewportScroller.scrollToPosition([0, 0]);
            this.store.dispatch(new ToggleGlobalLoader(false));
        });
    }

    public trackByFn(index: number, title: TitleCredit) {
        return title.id;
    }

    public loadFullTitleCredits(person: Person, title: Title, department: string) {
        this.loadingAdditionalCredits$.next(true);
        this.store.dispatch(new LoadFullTitleCredits(person, title, department))
            .pipe(finalize(() => this.loadingAdditionalCredits$.next(false)))
            .subscribe();
    }
}
