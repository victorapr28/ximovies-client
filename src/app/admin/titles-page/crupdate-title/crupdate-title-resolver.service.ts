import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import {catchError, mergeMap} from 'rxjs/operators';
import {EMPTY, Observable, of} from 'rxjs';
import {Store} from '@ngxs/store';
import {TitlesService} from '../../../site/titles/titles.service';

@Injectable({
    providedIn: 'root'
})
export class CrupdateTitleResolverService implements Resolve<Observable<any>> {
    constructor(
        private router: Router,
        private store: Store,
        private titles: TitlesService,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const query = {fullCredits: true, keywords: true, countries: true, seasons: true, skipUpdating: true, allVideos: true};
        return this.titles.get(+route.params.id, query).pipe(
            catchError(() => {
                this.router.navigate(['/admin/titles']);
                return EMPTY;
            }),
            mergeMap(response => {
                if (response) {
                    return of(response);
                } else {
                    this.router.navigate(['/admin/titles']);
                    return EMPTY;
                }
            })
        );
    }
}

