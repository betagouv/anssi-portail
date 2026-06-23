---
layout: defaut
slug: fr-ges
permalink: /contacts/fr-ges.html
titreHtml: 'Contacts du Grand Est | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
