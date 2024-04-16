import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  renderNavbar() {
    const logoAnchor = this.document.createElement('a');
    logoAnchor.setAttribute('ng-reflect-router-link', '/');
    logoAnchor.setAttribute('href', '/');

    const logo = this.document.createElement('img');
    logo.setAttribute('class', 'brand-logo');
    logo.setAttribute('src', '/assets/brainwave_logo.svg');
    logo.setAttribute('alt', 'logo');
    logoAnchor.appendChild(logo);

    const pagesList = this.document.createElement('ul');
    pagesList.setAttribute('class', 'navbar-list');

    const pages = ['Quiz', 'Leaderboard', 'Manage Questions'];

    pages.forEach((page) => {
      const listElement = this.document.createElement('li');
      const pageAnchor = this.document.createElement('a');
      const pageText = this.document.createTextNode(`${page}`);
      pageAnchor.appendChild(pageText);
      listElement.appendChild(pageAnchor);
      pagesList.appendChild(listElement);
    });

    const element = this.document.getElementById('navbar-id');

    if (element) {
      element.appendChild(logoAnchor);
      element.appendChild(pagesList);
    }
  }
}
