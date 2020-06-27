import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {HydrateTitle, ResetState} from './state/crupdate-title-actions';
import {CrupdateTitleState} from './state/crupdate-title-state';
import {BehaviorSubject, Observable} from 'rxjs';
import {Title} from '../../../models/title';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';

@Component({
    selector: 'crupdate-title',
    templateUrl: './crupdate-title.component.html',
    styleUrls: ['./crupdate-title.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateTitleComponent implements OnInit, OnDestroy {
    @Select(CrupdateTitleState.loading) loading$: Observable<boolean>;
    public title: Title;
    public activePanel$ = new BehaviorSubject<string>('primaryFacts');

    constructor(
        private store: Store,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.store.dispatch(new ToggleGlobalLoader(false));
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.store.dispatch(new HydrateTitle(data.api?.title));
            this.title = data.api?.title;
        });
        this.route.queryParams.subscribe(params => {
            if (params.active) this.activePanel$.next(params.active);
        });
    }

    ngOnDestroy() {
        this.store.dispatch(new ResetState());
    }

    public openPanel(name: string) {
        this.router.navigate([], {queryParams: {active: name}});
    }

    public titleCreated(): boolean {
        return !!this.store.selectSnapshot(CrupdateTitleState.title).id;
    }
}
