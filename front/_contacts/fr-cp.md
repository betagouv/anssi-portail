---
layout: defaut
slug: fr-cp
permalink: /contacts/fr-cp.html
titreHtml: 'Contacts de Clipperton | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
