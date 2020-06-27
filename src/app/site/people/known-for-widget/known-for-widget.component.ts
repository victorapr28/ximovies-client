import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Person} from '../../../models/person';
import {TitleUrlsService} from '../../titles/title-urls.service';

@Component({
    selector: 'known-for-widget',
    templateUrl: './known-for-widget.component.html',
    styleUrls: ['./known-for-widget.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnownForWidgetComponent {
    @Input() person: Person;
    @Input() showCredits = 1;

    constructor(public urls: TitleUrlsService) {}
}
