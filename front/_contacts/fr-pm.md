---
layout: defaut
slug: fr-pm
permalink: /contacts/fr-pm.html
titreHtml: 'Contacts de Saint-Pierre-et-Miquelon | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
