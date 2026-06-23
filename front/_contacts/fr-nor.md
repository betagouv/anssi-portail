---
layout: defaut
slug: fr-nor
permalink: /contacts/fr-nor.html
titreHtml: 'Contacts de Normandie | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
