---
layout: defaut
slug: fr-occ
titreHtml: "Contacts d'Occitanie | MesServicesCyber"
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
