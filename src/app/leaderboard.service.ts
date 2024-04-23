import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Category } from './category';
import { Leaderboard } from './leaderboard';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private api_link = 'http://localhost:4300/';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private appService: AppService
  ) {}

  renderDropdownElements(elements: Category[], elementToAppendId: string) {
    for (let i = 0; i < elements.length; i++) {
      const option = this.document.createElement('option');
      option.setAttribute('value', String(elements[i].category_id));
      const option_text = this.document.createTextNode(
        elements[i].category_name
      );
      option.appendChild(option_text);

      const element = this.document.getElementById(elementToAppendId);

      if (element) element.appendChild(option);
    }
  }

  async getLeaderboardData(category_id: number) {
    try {
      const response = await fetch(
        this.api_link + 'score/leaderboard/' + category_id
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const data: Leaderboard[] = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  }

  async renderLeaderboardList(leaderboard: Leaderboard[]) {
    for (let i = 0; i < leaderboard.length; i++) {
      const listElement = this.document.createElement('li');
      listElement.setAttribute('id', 'list-element-' + i);

      const position = this.document.createElement('span');
      position.setAttribute('class', 'position');
      const position_text = this.document.createTextNode(String(i + 1) + '.');
      position.appendChild(position_text);

      if (i == 0) {
        const crown_span = this.document.createElement('span');
        crown_span.setAttribute('class', 'crown-span');
        const crown = this.document.createElement('img');
        crown.setAttribute('class', 'crown-img');
        crown.setAttribute('src', '../../assets/crown.png');

        crown_span.appendChild(crown);
        listElement.appendChild(crown_span);
        position.setAttribute('class', 'position-1');
      }

      const username = this.document.createElement('span');
      username.setAttribute('class', 'username');
      const username_text = this.document.createTextNode(
        leaderboard[i].username
      );
      username.appendChild(username_text);

      const category = this.document.createElement('span');
      category.setAttribute('class', 'category');
      const category_text = this.document.createTextNode(
        await this.translateCategoryIdToCategoryName(leaderboard[i].category_id)
      );
      category.appendChild(category_text);

      const score = this.document.createElement('span');
      score.setAttribute('class', 'score');
      const score_text = this.document.createTextNode(
        String(leaderboard[i].score)
      );
      score.appendChild(score_text);

      const date = this.document.createElement('span');
      date.setAttribute('class', 'date');
      const date_text = this.document.createTextNode(
        String(leaderboard[i].date).split('T')[0]
      );
      date.appendChild(date_text);

      listElement.appendChild(position);
      listElement.appendChild(username);
      listElement.appendChild(category);
      listElement.appendChild(score);
      listElement.appendChild(date);

      const element = this.document.getElementById('leaderboard-ordered-list');

      if (element) element.appendChild(listElement);
    }
  }

  removeLeaderboardElements() {
    for (let x = 0; x < 10; x++) {
      const recordForDeleting = this.document.getElementById(
        'list-element-' + x
      );
      recordForDeleting?.remove();
    }
  }

  async translateCategoryIdToCategoryName(
    category_id: number
  ): Promise<string> {
    const categories: Category[] = await this.getCategoryData();

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].category_id == category_id) {
        return categories[i].category_name;
      }
    }
    return '';
  }

  async getCategoryData() {
    try {
      const response = await fetch(this.api_link + 'category');
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const data: Category[] = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  }

  async createResettingPopUpWindow(elementToAppend: string) {
    const popupOverlay = this.document.createElement('div');
    popupOverlay.setAttribute('class', 'overlay-container');
    popupOverlay.setAttribute('id', 'reset-PopupOverlay');

    const popupWindow = this.document.createElement('div');
    popupWindow.setAttribute('class', 'popup-window');
    popupWindow.setAttribute('id', 'reset-popup-window');

    const popupTitle = this.document.createElement('h2');
    popupTitle.textContent = `Are you sure you want to reset leaderboard?`;

    const popupNotification = this.document.createElement('h3');
    popupNotification.textContent =
      'This process is irreversible and will result in deleting all existing entries';

    const yesButton = this.document.createElement('button');
    yesButton.setAttribute('type', 'delete');
    yesButton.setAttribute('class', 'do-reset-button');
    yesButton.setAttribute('id', 'confirm-reset-button');
    yesButton.textContent = 'Yes';

    const noButton = this.document.createElement('button');
    noButton.setAttribute('type', 'delete');
    noButton.setAttribute('class', 'do-not-reset-button');
    noButton.setAttribute('id', 'deny-reset-button');
    noButton.textContent = 'No';

    popupWindow.appendChild(popupTitle);
    popupWindow.appendChild(popupNotification);
    popupWindow.appendChild(yesButton);
    popupWindow.appendChild(noButton);

    popupOverlay.appendChild(popupWindow);

    const toAppend = this.document.getElementById(elementToAppend);

    if (toAppend) toAppend.appendChild(popupOverlay);

    const confirmResettingButton = this.document.getElementById(
      'confirm-reset-button'
    );

    const denyResettingButton =
      this.document.getElementById('deny-reset-button');

    const component = this;

    if (confirmResettingButton) {
      confirmResettingButton.addEventListener('click', async function () {
        await component.emptyLeaderboard().then(async function () {
          component.appService.closePopup('reset-PopupOverlay');
          component.removeLeaderboardElements();
          component.renderLeaderboardList(
            await component.getLeaderboardData(0)
          );
        });
      });
    }

    document.addEventListener('click', this.handleOutsidePopupClick.bind(this));

    if (denyResettingButton) {
      denyResettingButton.addEventListener('click', async function () {
        component.appService.closePopup('reset-PopupOverlay');
      });
    }
  }

  handleOutsidePopupClick(event: MouseEvent) {
    const popupElement = this.document.getElementById('reset-popup-window');
    const popupOverlayElement =
      this.document.getElementById('reset-PopupOverlay');

    if (popupElement && popupOverlayElement) {
      const isClickedInsidePopup = popupElement.contains(event.target as Node);
      const isClickedInsideOverlay = popupOverlayElement.contains(
        event.target as Node
      );

      if (!isClickedInsidePopup && isClickedInsideOverlay) {
        this.appService.closePopup('reset-PopupOverlay');
      }
    }
  }

  async emptyLeaderboard() {
    try {
      const data = await fetch(this.api_link + 'score/empty', {
        method: 'DELETE',
        headers: {
          ['Content-Type']: 'application/json',
        },
      }).then(
        async (response) => {
          const data = await response.json();
          return data;
        },
        (err) => console.error(err)
      );
      return data;
    } catch (error) {
      console.error('Error happened: ', error);
    }
  }
}
