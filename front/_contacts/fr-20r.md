---
layout: defaut
slug: fr-20r
titreHtml: 'Contacts de Corse | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
