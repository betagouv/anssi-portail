---
layout: defaut
slug: fr-nc
permalink: /contacts/fr-nc.html
titreHtml: 'Contacts de Nouvelle-Calédonie | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
