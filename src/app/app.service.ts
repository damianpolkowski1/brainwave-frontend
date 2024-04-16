import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  renderNavbar() {
    const logoAnchor = document.createElement('a');
    logoAnchor.setAttribute('ng-reflect-router-link', '/');
    logoAnchor.setAttribute('href', '/');

    const logo = document.createElement('img');
    logo.setAttribute('class', 'brand-logo');
    logo.setAttribute('src', '/assets/brainwave_logo.svg');
    logo.setAttribute('alt', 'logo');
    logoAnchor.appendChild(logo);

    const pagesList = document.createElement('ul');
    pagesList.setAttribute('class', 'navbar-list');

    const pages = ['Quiz', 'Leaderboard', 'Manage Questions'];

    pages.forEach((page) => {
      const listElement = document.createElement('li');
      const pageAnchor = document.createElement('a');
      const pageText = document.createTextNode(`${page}`);
      pageAnchor.appendChild(pageText);
      listElement.appendChild(pageAnchor);
      pagesList.appendChild(listElement);
    });

    const element = document.getElementById('navbar-id');

    if (element) {
      element.appendChild(logoAnchor);
      element.appendChild(pagesList);
    }
  }
}
