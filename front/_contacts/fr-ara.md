---
layout: defaut
slug: fr-ara
permalink: /contacts/fr-ara.html
titreHtml: "Contacts d'Auvergne-Rhône-Alpes | MesServicesCyber"
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
