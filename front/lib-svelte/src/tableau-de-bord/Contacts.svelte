<script lang="ts">
  import { DsfrTabs, Icone } from '@lab-anssi/ui-kit';
  import type { ComponentProps } from 'svelte';
  import Lien from '../ui/Lien.svelte';
  import TitreDeSection from './TitreDeSection.svelte';

  const tabs: ComponentProps<typeof DsfrTabs>['tabs'] = ['sectoriels', 'régionaux', 'nationaux'].map((id) => ({
    id,
    label: '',
    content: '',
  }));

  let indexTabActivée = $state(1);

  const surChangementDeTab = ({ detail }: { detail: { index: number } }) => {
    indexTabActivée = detail.index;
  };
</script>

<div class="contacts">
  <TitreDeSection libellé="Les contacts cyber pour vous guider" icône="customer-service-line" />

  <dsfr-tabs {tabs} activeTabIndex={indexTabActivée} ontabchanged={surChangementDeTab}>
    <div slot="tab-1">
      Contacts sectoriels <span class="tab-tag" class:actif={indexTabActivée === 0}><span>1</span></span>
    </div>
    <div slot="tab-2">
      Contacts régionaux <span class="tab-tag" class:actif={indexTabActivée === 1}><span>30</span></span>
    </div>
    <div slot="tab-3">
      Contacts sectoriels <span class="tab-tag" class:actif={indexTabActivée === 2}><span>4</span></span>
    </div>
    <div slot="panel-1">
      <div class="contenu">
        <p class="texte-mention-xs">
          Contactez toujours en priorité les personnes responsables au sein de votre organisation.
        </p>
        <div class="cartes"></div>
        <div class="pied-de-page">
          <Icone nom="verified-badge-fill" />
          <div>
            <span>Trouvez des prestataires qualifiés et labellisés pour vous aider.&#32;</span><Lien
              libelle="Accéder aux prestataires"
              href="/prestataires-labellises"
            />
          </div>
        </div>
      </div>
    </div>
  </dsfr-tabs>
</div>

<style lang="scss">
  .contacts {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .tab-tag {
      display: inline-grid;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      vertical-align: middle;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.2rem;
      color: var(--text-action-high-grey, #161616);
      background: var(--_background-default-grey, #fff);

      &.actif {
        color: var(--text-inverted-grey, #fff);
        background: var(--background-active-blue-france, #000091);
      }

      > span {
        transform: translateY(-1px);
      }
    }

    .contenu {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .pied-de-page {
      display: flex;
      gap: 0.5rem;

      > :global(.icone) {
        color: var(--artwork-major-blue-france);
      }
    }
  }
</style>
