---
id: 'en-technical-position-paper-confidential-computing'
nom: 'Technical Position Paper on Confidential Computing'
langue: 'EN'
collections:
  - 'Autre'
listeDocuments:
  - '[object Object]'
dateMiseAJour: '2025-10-17T00:00:00.000Z'
thematique: 'Confidential Computing'
besoins:
  - 'SECURISER'
---

<p>Confidential Computing is a set of technologies designed to execute sensitive workloads in remote environments (eg. Virtual Machines). It complements effectively at-rest and in-transit encryption by encrypting data in-use, shielding them from direct inspection by the administrator on shared infrastructure. The technology is not without vulnerabilities and limitations, and lacks security certifications, but still provides significant defence-in-depth. If used correctly, it may raise the complexity of attacks from the host or other tenants on the same physical machine, and reduce the size of the Trusted Computing Base (TCB), leading to a smaller attack surface overall.</p><p>However, Confidential Computing is not secure enough to protect data integrity and confidentiality against a hostile administrator performing targeted, active attacks. Under such a threat model, users must avoid running on shared infrastructure operated by providers they cannot trust, and are rather encouraged to leverage Confidential Computing to increase their security posture on dedicated hardware instead. When manipulating highly sensitive data, trust and security of the entire software and hardware supply-chain must also be carefully taken into account.</p><p>In addition to the security limitations inherent to Confidential Computing, it is also very difficult to use in a secure manner. Workloads must be hardened against specific attacks from the host. They must also be proven genuine through Remote Attestation, and decryption of sensitive data should be cryptographically tied to this attestation process. This deeply changes the way workloads are architectured and deployed. The ecosystem currently lacks mature software stacks integrating attestation with secret delivery, and deploying a complete solution involves deep expertise to ensure the integrity of the entire TCB.</p><p>The current analysis shows that Confidential Computing is not sufficient on its own to secure an entire system, or to meet the requirements described in section 19.6 of the SecNumCloud 3.2 framework. Users are encouraged to remain cautious, opting into the technology only when the expected security benefits exceed the development costs, factoring in residual risks into their threat model. On the other hand, providers need to offer solutions that allow remote attestation of the entire TCB, and collaborate on open protocols to ease interoperability between workload execution, remote attestation and secret provisioning.</p>
