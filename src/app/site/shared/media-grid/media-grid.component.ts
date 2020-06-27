import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {Title} from '../../../models/title';
import {Person} from '../../../models/person';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {MEDIA_TYPE} from '../../media-type';
import {PlayerOverlayService} from '../../player/player-overlay.service';

@Component({
    selector: 'media-grid',
    templateUrl: './media-grid.component.html',
    styleUrls: ['./media-grid.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaGridComponent {
    @Input() items: (Title|Person)[] = [];
    @Input() showPlayButton = false;
    @Output() actionClick = new EventEmitter();

    public trackByFn = (i: number, item: Title|Person) => item.id;

    constructor(
        public urls: TitleUrlsService,
        private playerOverlay: PlayerOverlayService,
    ) {}

    public isPerson(item: Title|Person) {
        return item.type === MEDIA_TYPE.PERSON;
    }

    public playVideo(title: Title) {
        this.playerOverlay.open(title.videos[0], title);
    }
}
