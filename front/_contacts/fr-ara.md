---
layout: defaut
slug: fr-ara
titreHtml: "Contacts d'Auvergne-Rhône-Alpes | MesServicesCyber"
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
