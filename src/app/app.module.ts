import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {MTDB_CONFIG} from './mtdb-config';
import {AppRoutingModule} from './app-routing.module';
import {SiteModule} from './site/site.module';
import {NgxsModule} from '@ngxs/store';
import {AppState} from './state/app-state';
import {AuthModule} from '@common/auth/auth.module';
import {AccountSettingsModule} from '@common/account-settings/account-settings.module';
import {PagesModule} from '@common/core/pages/shared/pages.module';
import {APP_CONFIG} from '@common/core/config/app-config';
import {NotFoundRoutingModule} from '@common/core/pages/not-found-routing.module';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CookieNoticeModule} from '@common/gdpr/cookie-notice/cookie-notice.module';
import {ContactPageModule} from '@common/contact/contact-page.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {CORE_PROVIDERS} from '@common/core/core-providers';
import {Bootstrapper} from '@common/core/bootstrapper.service';
import {AppBootstrapperService} from './app-bootstrapper.service';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HammerModule,
        HttpClientModule,
        RouterModule.forRoot([], {scrollPositionRestoration: 'top'}),
        AuthModule,
        AccountSettingsModule,
        AppRoutingModule,
        PagesModule,
        CookieNoticeModule,
        ContactPageModule,
        LoadingIndicatorModule,

        NgxsModule.forRoot([AppState], {developmentMode: false}),

        // need to load these after "NgxsModule.forRoot"
        // as site module contains "NgxsModule.forFeature"
        SiteModule,
        NotFoundRoutingModule,

        // material
        MatSnackBarModule,
    ],
    providers: [
        ...CORE_PROVIDERS,
        {
            provide: Bootstrapper,
            useClass: AppBootstrapperService,
        },
        {
            provide: APP_CONFIG,
            useValue: MTDB_CONFIG,
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
