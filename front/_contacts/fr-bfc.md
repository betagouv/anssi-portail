---
layout: defaut
titreHtml: 'Contacts de Bourgogne-Franche-Comté | MesServicesCyber'
styles: /assets/styles/contacts.css
modifiéLe: 2025-02-12
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
