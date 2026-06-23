---
layout: defaut
slug: fr-pdl
permalink: /contacts/fr-pdl.html
titreHtml: 'Contacts des Pays de la Loire | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
