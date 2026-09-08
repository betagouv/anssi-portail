---
layout: defaut
slug: fr-bfc
titreHtml: 'Contacts de Bourgogne-Franche-Comté | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
