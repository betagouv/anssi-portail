---
layout: defaut
slug: fr-pf
permalink: /contacts/fr-pf.html
titreHtml: 'Contacts de Polynésie française | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
