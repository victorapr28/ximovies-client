import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {Store} from '@ngxs/store';
import {AppearanceListenerService} from '@common/shared/appearance/appearance-listener.service';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
    selector: 'homepage-host',
    templateUrl: './homepage-host.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageHostComponent implements OnInit {
    public shouldShowLandingPage$ = new BehaviorSubject(false);

    constructor(
        public settings: Settings,
        public currentUser: CurrentUser,
        private store: Store,
        private appearance: AppearanceListenerService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        setTimeout(() => this.store.dispatch(new ToggleGlobalLoader(false)));
        if (this.appearance.active) {
            this.route.queryParams.subscribe(() => {
                this.setShouldShowLandingPage();
            });
        } else {
            this.setShouldShowLandingPage();
        }
    }

    private setShouldShowLandingPage() {
        this.shouldShowLandingPage$.next(
            (this.settings.get('billing.force_subscription') && !this.currentUser.isLoggedIn()) ||
            (this.appearance.active && this.route.snapshot.queryParams.landing)
        );
    }
}
