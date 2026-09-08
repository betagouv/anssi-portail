---
layout: defaut
slug: fr-bre
titreHtml: 'Contacts de Bretagne | MesServicesCyber'
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
