import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {Select} from '@ngxs/store';
import {AppState} from './state/app-state';
import {Observable} from 'rxjs';
import {CustomHomepage} from '@common/core/pages/shared/custom-homepage.service';
import {Settings} from '@common/core/config/settings.service';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {MetaTagsService} from '@common/core/meta/meta-tags.service';
import cssVars from 'css-vars-ponyfill';
import {CookieNoticeService} from '@common/gdpr/cookie-notice/cookie-notice.service';
import {BrowseTitlesComponent} from './site/titles/components/browse-titles/browse-titles.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @Select(AppState.loading) loading$: Observable<boolean>;

    constructor(
        private customHomepage: CustomHomepage,
        private settings: Settings,
        private httpClient: AppHttpClient,
        private router: Router,
        private meta: MetaTagsService,
        private cookieNotice: CookieNoticeService,
    ) {}

    ngOnInit() {
        this.customHomepage.select({routes: [
            {
                routeConfig: {
                    path: 'browse',
                    component: BrowseTitlesComponent,
                    data: {permissions: ['titles.view'], name: 'browse', willSetSeo: true},
                },
                makeRoot: false,
                name: 'browse',
            }
        ]});
        this.settings.setHttpClient(this.httpClient);
        this.meta.init();

        // google analytics
        if (this.settings.get('analytics.tracking_code')) {
            this.triggerAnalyticsPageView();
        }

        this.loadCssVariablesPolyfill();
        this.cookieNotice.maybeShow();
    }

    private triggerAnalyticsPageView() {
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if ( ! window['ga']) return;
                window['ga']('set', 'page', event.urlAfterRedirects);
                window['ga']('send', 'pageview');
            });
    }

    private loadCssVariablesPolyfill() {
        const isNativeSupport = typeof window !== 'undefined' &&
            window['CSS'] &&
            window['CSS'].supports &&
            window['CSS'].supports('(--a: 0)');
        if ( ! isNativeSupport) {
            cssVars();
        }
    }
}
