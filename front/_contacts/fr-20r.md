---
layout: defaut
slug: fr-20r
permalink: /contacts/fr-20r.html
titreHtml: 'Contacts de Corse | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
