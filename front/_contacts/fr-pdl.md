---
layout: defaut
slug: fr-pdl
titreHtml: 'Contacts des Pays de la Loire | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
