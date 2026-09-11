---
layout: defaut
titreHtml: 'Contacts de Centre-Val de Loire | MesServicesCyber'
styles: /assets/styles/contacts.css
modifiéLe: 2025-02-12
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
