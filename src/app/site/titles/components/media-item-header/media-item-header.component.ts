import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import {Select} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Video} from '../../../../models/video';
import {Settings} from '@common/core/config/settings.service';
import {PlayerOverlayService} from '../../../player/player-overlay.service';

@Component({
    selector: 'media-item-header',
    templateUrl: './media-item-header.component.html',
    styleUrls: ['./media-item-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaItemHeaderComponent {
    @Select(TitleState.primaryVideo) primaryVideo$: Observable<Video>;

    @Input() backdrop: string;
    @Input() transparent = false;

    constructor(
        private playerOverlay: PlayerOverlayService,
        public settings: Settings,
    ) {}

    @HostBinding('style.background-image') get backgroundImage() {
        if (this.backdrop) {
            return 'url(' + this.backdrop + ')';
        }
    }

    @HostBinding('class.no-backdrop') get noBackdrop() {
        if ( ! this.backdrop) {
            return 'no-backdrop';
        }
    }

    public playVideo(video: Video) {
        this.playerOverlay.open(video);
    }
}
