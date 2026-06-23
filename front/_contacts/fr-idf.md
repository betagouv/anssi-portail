---
layout: defaut
slug: fr-idf
permalink: /contacts/fr-idf.html
titreHtml: "Contacts d'Île-de-France | MesServicesCyber"
styles: /assets/styles/contacts.css
---

{% assign contact = site.data.contacts[page.slug] %}
{% include contact-region.html src=contact %}
