---
layout: defaut
slug: fr-cvl
titreHtml: 'Contacts de Centre-Val de Loire | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
